import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import Select from 'react-select'; // Import React Select
import { Typography, Card, CardHeader, CardBody } from "@material-tailwind/react";
import 'leaflet/dist/leaflet.css';

// Define role colors
const roleColors = {
    setter: 'green',
    paralegal: 'blue',
    advisor: 'red',
};

// Function to get marker icon based on role
const getMarkerIcon = (role) => {
    return new Icon({
        iconUrl: `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='${roleColors[role]}' d='M12.5 0C9.5 0 7 2.5 7 5.5c0 2 1.5 4 3.5 5.5 2-1.5 3.5-3.5 3.5-5.5C17 2.5 14.5 0 12.5 0zm-2 20h4v20h-4V20z'/%3E%3C/svg%3E`,
        iconSize: [25, 41],
    });
};

// Sample data
const sampleData = [
    { name: 'John Doe', role: 'setter', state: 'California', lat: 34.0522, lng: -118.2437, performance: 'High' },
    { name: 'Jane Smith', role: 'paralegal', state: 'Texas', lat: 31.9686, lng: -99.9018, performance: 'Medium' },
    { name: 'Alice Johnson', role: 'advisor', state: 'New York', lat: 40.7128, lng: -74.0060, performance: 'Low' },
    { name: 'Michael Brown', role: 'setter', state: 'Florida', lat: 27.9949, lng: -81.7603, performance: 'High' },
    { name: 'Emily Davis', role: 'paralegal', state: 'Illinois', lat: 40.6331, lng: -89.3985, performance: 'Medium' },
    { name: 'Chris Wilson', role: 'advisor', state: 'Washington', lat: 47.7511, lng: -120.7401, performance: 'Low' },
    { name: 'Jessica Lee', role: 'setter', state: 'Georgia', lat: 32.1656, lng: -82.9001, performance: 'High' },
    { name: 'David Martinez', role: 'paralegal', state: 'Ohio', lat: 40.4173, lng: -82.9071, performance: 'Medium' },
    { name: 'Sarah Thomas', role: 'advisor', state: 'Michigan', lat: 44.3148, lng: -85.6024, performance: 'Low' },
    { name: 'Daniel Garcia', role: 'setter', state: 'New Jersey', lat: 40.2989, lng: -74.5210, performance: 'High' },
];

const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'setter', label: 'Setter' },
    { value: 'paralegal', label: 'Paralegal' },
    { value: 'advisor', label: 'Advisor' },
];

const stateOptions = [
    { value: 'all', label: 'All States' },
    { value: 'California', label: 'California' },
    { value: 'Texas', label: 'Texas' },
    { value: 'New York', label: 'New York' },
    { value: 'Florida', label: 'Florida' },
    { value: 'Illinois', label: 'Illinois' },
    { value: 'Washington', label: 'Washington' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Ohio', label: 'Ohio' },
    { value: 'Michigan', label: 'Michigan' },
    { value: 'New Jersey', label: 'New Jersey' },
];

const Map = () => {
    const [selectedRole, setSelectedRole] = useState(roleOptions[0]);
    const [selectedState, setSelectedState] = useState(stateOptions[0]);
    

    const handleRoleChange = (selected) => {
        setSelectedRole(selected);
    };

    const handleStateChange = (selected) => {
  
        setSelectedState(selected);
    };

    const filteredData = sampleData.filter(item => {
        const roleMatch = selectedRole.value === 'all' || item.role === selectedRole.value;
        const stateMatch = selectedState.value === 'all' || item.state === selectedState.value;
        return roleMatch && stateMatch;
    });

    const defaultPosition = filteredData.length > 0 
        ? [filteredData[0].lat, filteredData[0].lng] 
        : [37.7749, -95.3698];

    return (
        <div className="flex flex-col gap-4">
            <Card className="w-full md:w-3/4 lg:w-[1100px] mx-auto h-fit">
                <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6">
                    <Typography variant="h6" color="blue-gray" className="mb-1">Performance by State</Typography>
                </CardHeader>
                <CardBody>
                    <div className="flex justify-between mb-4">
                        <Select 
                            value={selectedRole} 
                            onChange={handleRoleChange} 
                            options={roleOptions} 
                            className="w-48"
                            placeholder="Select Role"
                        />
                        <Select 
                            value={selectedState} 
                            onChange={handleStateChange} 
                            options={stateOptions} 
                            className="w-48"
                            placeholder="Select State"
                        />
                    </div>
                    <div style={{ height: '600px', width: '100%' }}>
                        <MapContainer center={defaultPosition} zoom={4} style={{ height: '100%', width: '100%' }} className='z-0'>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {filteredData.map((item, index) => (
                                <Marker key={index} position={[item.lat, item.lng]} icon={getMarkerIcon(item.role)}>
                                    <Popup>
                                        <div>
                                            <strong>{item.name}</strong><br />
                                            Role: {item.role}<br />
                                            State: {item.state}<br />
                                            Performance: {item.performance}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default Map;
