import React, { useState } from 'react';
import { 
    Select, 
    MenuItem, 
    TextField, 
    FormControlLabel, 
    Checkbox, 
    FormHelperText, 
    FormControl, 
    InputLabel, 
    InputAdornment 
} from '@mui/material';
import { Search } from '@mui/icons-material';

const InputField = ({ field }) => {
    const {
        required = false,
        type,
        options = {},
        is_multiple,
        label,
        name,
        value,
        placeholder,
        extra,
        id,
        className,
        col = '12',
        hidden
    } = field;

    const optionsArray = Array.isArray(options)
        ? options
        : Object.entries(options).map(([key, val]) => ({ key, value: val }));

    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`col-lg-${col} fv-row fv-plugins-icon-container my-2`} hidden={hidden}>
            {label && (
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel htmlFor={id}></InputLabel>
                    {type === 'select' ? (
                        <Select
                            name={name}
                            id={id}
                            className={`form-control ${className}`}
                            required={required}
                            multiple={is_multiple}
                            value={value || []}
                            {...extra}
                        >
                            <MenuItem value=""><em>Choose</em></MenuItem>
                            {optionsArray.length > 0 ? (
                                optionsArray.map(option => (
                                    <MenuItem key={option.key} value={option.key}>
                                        {option.value}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No options available</MenuItem>
                            )}
                        </Select>
                    ) : type === 'textarea' ? (
                        <TextField
                            name={name}
                            id={id}
                            className={`form-control ${className}`}
                            required={required}
                            multiline
                            value={value}
                            placeholder={placeholder}
                            variant="outlined"
                            rows={4}
                            {...extra}
                        />
                    ) : type === 'checkbox' ? (
                        <FormControlLabel
                            control={<Checkbox name={name} checked={value === 1} {...extra} />}
                            label={label}
                        />
                    ) : type === 'file' ? (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ marginTop: '8px', marginBottom: '8px' }}
                                {...extra}
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{ width: '100%', height: 'auto', marginTop: '10px' }}
                                />
                            )}
                        </div>
                    ) : (
                        <TextField
                            type={type}
                            name={name}
                            id={id}
                            className={`form-control ${className}`}
                            required={required}
                            placeholder={placeholder}
                            value={value}
                            variant="outlined"
                            InputProps={{
                                startAdornment: type === 'search' ? (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ) : null,
                            }}
                            {...extra}
                        />
                    )}
                    <FormHelperText className="invalid-feedback">This is a helper text.</FormHelperText>
                </FormControl>
            )}
        </div>
    );
};

export default InputField;
