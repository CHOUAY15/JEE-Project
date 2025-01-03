
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setTokens } from './authSlice';

const CallbackPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');
            console.log("",code)

            if (code) {
                try {
                    const response = await fetch('http://localhost:8888/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code }),
                    });

                    const data = await response.json();

                    // Store tokens in Redux and localStorage
                    dispatch(setTokens({
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                    }));

                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);

                    // Redirect to dashboard
                    navigate('/dashboard/session');
                } catch (error) {
                    console.error('Authentication error:', error);
                    navigate('/');
                }
            }
        };

        handleCallback();
    }, [dispatch, location, navigate]);

    return <div>Processing authentication...</div>;
};

export default CallbackPage;
