import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { AgGridReact } from 'ag-grid-react';
import { AddUsers } from '@/pages/dashboard/AddUsers';
import {
    fetchUsersThunk,
    addUserThunk,
    deleteUserThunk,
    editUserThunk,
    changeUserStatusThunk
} from '@/Redux/slices/User.Slice';
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-material.css';
import { toast } from 'react-toastify';

export const UsersTable = () => {
    const dispatch = useDispatch();
    const { users, isloading, error } = useSelector(state => state.user);
    console.log(isloading)
    const [isModalOpen, setModalOpen] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await dispatch(fetchUsersThunk());
            if (fetchUsersThunk.rejected.match(result)) {
                toast.error("Failed to fetch users: " + result.error.message);
            }
        };
        fetchUsers();
    }, [dispatch]);

    const handleAddUser = async (userData) => {
        const result = await dispatch(addUserThunk(userData));
        if (addUserThunk.rejected.match(result)) {
            toast.error("Failed to create user: " + result.error.message);
        } else {
            toast.success("User created successfully.");
            // Optimistically update the users array
            dispatch(fetchUsersThunk()); // Re-fetch users or update the local state directly
        }
    };

    const handleEditUser = async (userData) => {
        const result = await dispatch(editUserThunk({ id: editUserId, userData }));
        if (editUserThunk.rejected.match(result)) {
            toast.error("Failed to update user: " + result.error.message);
        } else {
            toast.success("User updated successfully.");
            dispatch(fetchUsersThunk()); // Re-fetch users
            setEditUserId(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const result = await dispatch(deleteUserThunk(userId));
            if (deleteUserThunk.rejected.match(result)) {
                toast.error("Failed to delete user: " + result.error.message);
            } else {
                toast.success("User deleted successfully.");
                dispatch(fetchUsersThunk()); // Re-fetch users
            }
        }
    };

    const handleStatusChange = async (params) => {
        const newStatus = params.value === "Active" ? "non-Active" : "Active";
        const result = await dispatch(changeUserStatusThunk({ id: params.data.id, status: newStatus }));
        if (changeUserStatusThunk.rejected.match(result)) {
            toast.error("Failed to change user status: " + result.error.message);
        } else {
            toast.success("User status updated successfully.");
            dispatch(fetchUsersThunk()); // Re-fetch users
        }
    };

    const rowData = users.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        status: user.status,
    }));
console.log(rowData)
    const columnDefs = [
        { headerName: "ID", field: "id", sortable: true, filter: true, width: 60, cellStyle: { textAlign: 'center' } },
        { headerName: "Name", field: "name", sortable: true, filter: true, cellStyle: { textAlign: 'center' } },
        { headerName: "Email", field: "email", sortable: true, filter: true, cellStyle: { textAlign: 'center' } },
        { headerName: "Role", field: "role", sortable: true, filter: true, cellStyle: { textAlign: 'center' } },
        {
            headerName: "Status",
            field: "status",
            sortable: true,
            filter: 'agSetColumnFilter',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Active', 'non-Active'],
            },
            cellRenderer: (params) => (
                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-tight ${params.value === "Active" ? "text-green-800 bg-green-200 rounded-full" : "text-red-800 bg-red-200 rounded-full"}`}>
                    {params.value}
                </span>
            ),
            onCellValueChanged: handleStatusChange,
            cellStyle: { textAlign: 'center' },
        },
        {
            headerName: "Actions",
            field: "actions",
            width: 280,
            cellRenderer: (params) => (
                <div className="flex justify-center space-x-2">
                    <span
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                        onClick={() => {
                            setEditUserId(params.data.id);
                            setModalOpen(true);
                        }}
                    >
                        <FaEdit size={20} />
                    </span>
                    <span
                        className="cursor-pointer text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUser(params.data.id)}
                    >
                        <MdDeleteSweep size={20} />
                    </span>
                </div>
            ),
        },
    ];

    const userToEdit = Array.isArray(users) && editUserId
        ? users.find(user => user.id === editUserId)
        : null;

    return (
        <div className="mt-12 mb-8 flex flex-col items-center">
            <Card className="w-full max-w-6xl">
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">Users Table</Typography>
                    <span
                        className="cursor-pointer text-lightBlue-600 hover:text-lightBlue-800"
                        onClick={() => {
                            setEditUserId(null);
                            setModalOpen(true);
                        }}
                    >
                        Add User
                    </span>
                </CardHeader>
                <CardBody className="overflow-x-auto p-0">
                    {isloading ? (
                        <Typography className="text-center">Loading...</Typography>
                    ) : (
                        <div className="ag-theme-material-dark" style={{ height: 'fit-content', maxWidth: "100%" }}>
                            <AgGridReact
                                rowData={rowData}
                                columnDefs={columnDefs}
                                pagination={true}
                                paginationPageSize={10}
                                domLayout='autoHeight'
                                animateRows={true}
                                headerClass="bg-gray-800 text-white"
                                enableSorting={true}
                                enableFilter={true}
                                defaultColDef={{
                                    filter: true,
                                    sortable: true,
                                    resizable: true,
                                }}
                            />
                        </div>
                    )}
                </CardBody>
            </Card>

            {isModalOpen && (
                <AddUsers
                    isOpen={isModalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setEditUserId(null); // Clear edit user ID when modal closes
                    }}
                    onSubmit={editUserId ? handleEditUser : handleAddUser}
                    userData={userToEdit}
                />
            )}
        </div>
    );
};
