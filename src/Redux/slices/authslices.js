import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, signupUser, logoutUser, fetchCurrentUser, updateUserProfile } from '@/api/Users';
import { toast } from 'react-toastify';

// Async thunks
export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await loginUser(userData);
        localStorage.setItem('access_token', response.token);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
    try {
        const response = await signupUser(userData);
        localStorage.setItem('access_token', response.token);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const response = await fetchCurrentUser();
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
    try {
        const response = await updateUserProfile(profileData);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Logout action (async thunk)
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        // You can call a logout API here if required
        // await logoutUser();
        localStorage.removeItem('access_token'); // Remove the token from localStorage
        return { message: 'You have been logged out successfully!' }; // Custom message for success
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: !!localStorage.getItem('access_token'),
    },
    reducers: {
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('access_token');
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle login actions
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Handle signup actions
            .addCase(signup.pending, (state) => {
                state.loading = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Handle fetchUser actions
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Handle updateProfile actions
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload }; // Merge updated profile data
                toast.success('Profile updated successfully');
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Handle logout actions
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                // Ensure that state is updated after the token is cleared
                toast.success(action.payload.message || 'You have been logged out successfully!');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error('Logout failed. Please try again.');
            })
    },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
