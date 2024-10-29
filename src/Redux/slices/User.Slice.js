import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchUsers,
    addUser,
    editUser,
    deleteUser,
    changeUserStatus,
} from '@/api/Users'; // Adjust the import based on your API file structure

// Initial state
const initialState = {
    users: [], // Initialized as an empty array
    isloading: false,
    error: null,
};

// Async thunks
export const fetchUsersThunk = createAsyncThunk('user/fetchUsers', async () => {
    const response = await fetchUsers();
    return response; // Assuming this returns an array of users
});

export const addUserThunk = createAsyncThunk('user/addUser', async (userData) => {
    const response = await addUser(userData);
    return response; // Assuming this returns the added user
});

export const editUserThunk = createAsyncThunk('user/editUser', async ({ id, userData }) => {
    console.log("Editing user with ID:", id, "Data:", userData);
    const response = await editUser(id, userData);
    console.log(response)
    return response; // Assuming this returns the updated user
});

export const deleteUserThunk = createAsyncThunk('user/deleteUser', async (id) => {
    await deleteUser(id);
    return id; // Return the ID of the deleted user
});

export const changeUserStatusThunk = createAsyncThunk('user/changeUserStatus', async ({ id, status }) => {
    const response = await changeUserStatus(id, status);
    return response; // Assuming this returns the updated user status
});

// User slice
const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch users
            .addCase(fetchUsersThunk.pending, (state) => {
                state.isloading = true;
                state.error = null;
            })
            .addCase(fetchUsersThunk.fulfilled, (state, action) => {
                state.isloading = false;
                state.users = Array.isArray(action.payload.data) ? action.payload.data : [];  // Ensure it's an array
                state.error = null;
            })
            .addCase(fetchUsersThunk.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.error.message; // Set the error message
            })

            // Add user
            .addCase(addUserThunk.pending, (state) => {
                state.isloading = true;
            })
            .addCase(addUserThunk.fulfilled, (state, action) => {
                // state.users.push(action.payload);
                state.isloading = false;
                if (Array.isArray(state.users)) {
                    state.users.push(action.payload); // Add the new user
                }
            })
            .addCase(addUserThunk.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.error.message; // Set the error message
            })

            // Edit user
            .addCase(editUserThunk.pending, (state) => {
                state.isloading = true;
            })
            .addCase(editUserThunk.fulfilled, (state, action) => {
                state.isloading = false;
                console.log("Edit user payload:", action.payload); // Log the payload
                state.isloading = false;
                if (Array.isArray(state.users)) {
                    const index = state.users.findIndex(user => user.id === action.payload.id);
                    if (index !== -1) {
                        state.users[index] = { ...state.users[index], ...action.payload }; // Update user
                    } else {
                        console.warn(`User with ID ${action.payload.id} not found for update.`);
                    }
                } else {
                    console.error("Expected state.users to be an array, but found:", state.users);
                }
            })
            .addCase(editUserThunk.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.error.message; // Set the error message
            })

            // Delete user
            .addCase(deleteUserThunk.pending, (state) => {
                statisloading = true;
            })
            .addCase(deleteUserThunk.fulfilled, (state, action) => {
                console.log("Before deletion:", state.users);
                state.isloading = false;
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                // if (Array.isArray(state.users)) {
                //     state.users = state.users.filter(user => user.id !== action.payload);
                // }
            })
            .addCase(deleteUserThunk.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.error.message; // Set the error message
            })

            // Change user status
            .addCase(changeUserStatusThunk.pending, (state) => {
                state.isloading = true;
            })
            .addCase(changeUserStatusThunk.fulfilled, (state, action) => {
                state.isloading = false;
                if (Array.isArray(state.users)) {
                    const index = state.users.findIndex(user => user.id === action.payload);
                    if (index !== -1) {
                        state.users.splice(index, 1); // Remove user by index
                    }
                } else {
                    console.error("Expected state.users to be an array, but found:", state.users);
                }
            })
            .addCase(changeUserStatusThunk.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.error.message; // Set the error message
            });
    },
});

// Export actions and reducer
export const { clearError } = userSlice.actions;
export default userSlice.reducer;
