import React, { useState } from 'react';
import { Box, Button, Card, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getTokens } from '../../utils';
import { useAuth } from '../../contexts/AuthContext';

const StyledButton = styled(Button)({
    backgroundColor: '#ff6f61',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#ff3b2e',
    },
    borderRadius: '8px',
    padding: '10px 20px',
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#ddd',
        },
        '&:hover fieldset': {
            borderColor: '#ff6f61',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ff6f61',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#333', // Default label color
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#ff6f61', // Label color when focused
    },

    marginBottom: '20px',
});

const CustomStepper = styled(Stepper)({
    '& .MuiStepLabel-label': {
        display: 'none',
    },
    '& .MuiStepLabel-iconContainer': {
        paddingLeft: 0,
    },
    '& .MuiStepIcon-text': {
        fill: '#120201',
    },
    '& .MuiStepIcon-completed': {
        fill: '#ff6f61',
    },

    '& .MuiStepIcon-root': {
        color: '#ffdbd3',
    },
    '& .MuiStepIcon-active': {
        color: '#ff6f61',
        backgroundColor: '#ff6f61',
    },
});

const CustomStep = styled(Step)({
    '& .MuiStepIcon-root': {
        color: '#ffdbd3',
    },
});

const CustomStepLabel = styled(StepLabel)({
    '& .MuiStepIcon-root': {
        color: '#fbd5d1',
    },
});

const BackgroundBox = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    flexDirection: 'row-reverse',
    position: 'relative',
});

const CardBox = styled(Card)({
    maxWidth: '700px',
    width: '100%',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    zIndex: 1,
});

const ImageBox = styled(Box)({
    position: 'absolute',
    top: 0,
    width: '50%',
    height: '100%',
    left: 0,
    backgroundImage: 'url(https://media.product.which.co.uk/prod/images/original/c9d22eb823ef-hotel-booking.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
});

const ImageLeftBox = styled(Box)({
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    backgroundImage: 'url(https://milesopedia.com/wp-content/uploads/2021/11/Chambre-The-Ritz-Carlton-Maldives-Fari-Islands-278.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
});

const Login = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        answer: '',
        securityQuestion: '',
        securityQuestionId: 0,
        securityKey: '',
    });


    const { login } = useAuth();

    const steps = ['Login', 'Security Question', 'Security Key'];
    const [errors, setErrors] = useState({});
    const [apiSuccess, setApiSuccess] = useState(false);
    const navigate = useNavigate();

    const redirectToSignUp = () => {
        navigate('/signup');
    };

    const handleNext = async () => {
        const isValid = validate();
        if (!isValid) return;

        if (activeStep === 0) {
            // Login API call
            try {

                const encodeBase64 = btoa(formData.password);

                const response = await axios.get('https://pp7futon99.execute-api.us-east-1.amazonaws.com/dev/login', {
                    params: {
                        email: formData.email,
                        password: encodeBase64,
                    }
                });

                if (response.status === 200) {
                    // Check if groups include 'property-agents'
                    if (response.data.groups && (response.data.groups.includes("registered-users") || response.data.groups.includes("property-agents"))) {

                        sessionStorage.setItem('accessToken', response.data.user.accessToken);
                        sessionStorage.setItem('idToken', response.data.user.user_id);
                        sessionStorage.setItem('refreshToken', response.data.user.refreshToken);
                        sessionStorage.setItem('user', JSON.stringify(response.data.user));
                        sessionStorage.setItem('role', (response.data.groups[0]));
                        localStorage.setItem('role', (response.data.groups[0]));
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        sessionStorage.setItem('email', response.data.user.email);
                        sessionStorage.setItem('userType', response.data.user.userType);
                        sessionStorage.setItem('user_id', response.data.user.user_id);
                        login(response.data.user);

                        await axios.post('https://u4praapk75b7qqz4dssxytsxke0sxvmb.lambda-url.us-east-1.on.aws/', {
                            email: formData.email
                        });

                        // Proceed to security question step
                        // Simulate getting a random security question

                        const securityQuestionId = Math.floor(Math.random() * 3) + 1;
                        let securityQuestion = '';
                        switch (securityQuestionId) {
                            case 1:
                                securityQuestion = 'What is your favorite color?';
                                break;
                            case 2:
                                securityQuestion = 'What is your favorite sport?';
                                break;
                            case 3:
                                securityQuestion = 'What city were you born in?';
                                break;
                            default:
                                break;
                        }

                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            securityQuestion,
                            securityQuestionId,
                        }));
                        setActiveStep((prevActiveStep) => prevActiveStep + 1);
                        setApiSuccess(true);
                    } else {
                        // Handle unauthorized access
                        setErrors({ apiError: 'You are not authorized to access this application.' });
                    }
                } else if (response.status === 500) {
                    let errorMessage = 'Login failed. Please try again.';
                    if (response.data.message) {
                        errorMessage = response.data.message;
                    }
                    setErrors({ apiError: errorMessage });
                } else {
                    let errorMessage = 'Login failed. Please try again.';
                    if (response.data.message) {
                        errorMessage = response.data.message;
                    }
                    setErrors({ apiError: errorMessage });
                }
            } catch (error) {

                if (error.statusCode === 500) {
                    let errorMessage = 'Login failed. Please try again.';
                    if (error.message) {
                        errorMessage = error.message;
                    }
                    setErrors({ apiError: errorMessage });
                } else {
                    console.error('Error during login:', error);
                    setErrors({ apiError: "Error during login." });
                }
            }
        } else if (activeStep === 1) {
            // Implement logic for security question step
            try {
                const response = await axios.post('https://ljlnie0hfj.execute-api.us-east-1.amazonaws.com/dev/second-factor-authentication', {
                    action: 'fetch',
                    body: {
                        email: formData.email,
                        columns: ['favoriteColor', 'cityBorn', 'favoriteSports'],
                    },
                });

                if (response.data.statusCode === 200) {
                    const { favoriteColor, cityBorn, favoriteSports } = response.data.body;
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        favoriteColor,
                        cityBorn,
                        favoriteSports,
                    }));

                    // Check if user-entered answer matches any of the fetched answers
                    const { answer } = formData;
                    let answerMatched = false;

                    // Assuming we have favoriteColor, cityBorn, and favoriteSports as fetched answers
                    if (formData.securityQuestionId === 1 && answer.toLowerCase() === favoriteColor.toLowerCase()) {
                        answerMatched = true;
                    } else if (formData.securityQuestionId === 2 && answer.toLowerCase() === favoriteSports.toLowerCase()) {
                        answerMatched = true;
                    } else if (formData.securityQuestionId === 3 && answer.toLowerCase() === cityBorn.toLowerCase()) {
                        answerMatched = true;
                    }

                    if (answerMatched) {
                        setApiSuccess(true);
                        setActiveStep((prevActiveStep) => prevActiveStep + 1);
                    } else {
                        setErrors({ apiError: 'Security question answer does not match.' });
                    }
                } else {
                    let errorMessage = 'Failed to fetch security questions and answers.';
                    if (response.data.body.message) {
                        errorMessage = response.data.body.message;
                    }
                    setErrors({ apiError: errorMessage });
                }
            } catch (error) {
                console.error('Error fetching security questions:', error);
                let errorMessage = 'An error occurred while fetching security questions.';
                setErrors({ apiError: errorMessage });
            }


        } else if (activeStep === 2) {
            // Fetch third factor authentication
            try {
                const response = await axios.get('https://pp7futon99.execute-api.us-east-1.amazonaws.com/dev/secret-key-verify', {
                    params: {
                        email: formData.email,
                        secretKeyVerify: formData.securityKey,
                    },
                });

                if (response.status === 200 && response.data.message === "Authentication successful") {
                    // Proceed to next step upon successful verification
                    alert('Login successful!');
                    setApiSuccess(true);
                    if (localStorage.getItem('role') == "property-agents") {
                        navigate('/manage-rooms');
                    } else if (localStorage.getItem('role') == "registered-users") {
                        navigate('/dashboard');
                    }
                }
                else {
                    // Handle third factor authentication failure
                    alert('Failed to verify third factor authentication.');
                }
            } catch (error) {
                console.error('Error fetching third factor authentication:', error);
                let errorMessage = 'An error occurred while fetching third factor authentication.';
                setErrors({ apiError: errorMessage });
            }
        }
    };


    // const handleToken= async () => {
    //     const { accessToken, idToken } = getTokens();

    //     // Example of making an authenticated API call
    //     try {
    //         const response = await axios.get('https://api.example.com/protected-route', {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 'id-token': idToken,
    //             },
    //         });

    //         if (response.status === 200) {
    //             // Handle success response
    //         } else {
    //             // Handle error response
    //         }
    //     } catch (error) {
    //         console.error('Error fetching protected data:', error);
    //     }
    // };


    const handleBack = () => {
        if (activeStep === 0) {
            navigate("/");
        }
        if (!apiSuccess) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const validate = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (activeStep === 0) {
            if (!formData.email.trim()) tempErrors.email = 'Email is required';
            else if (!emailRegex.test(formData.email)) tempErrors.email = 'Invalid email format';
            if (!formData.password) tempErrors.password = 'Password is required';
        } else if (activeStep === 1) {
            if (!formData.answer.trim()) tempErrors.answer = 'Answer is required';
        } else if (activeStep === 2) {
            if (!formData.securityKey.trim()) tempErrors.securityKey = 'Security Key is required';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ marginBottom: '10px', color: '#333' }}>
                            Login
                        </Typography>
                        <StyledTextField
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <StyledTextField
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ marginBottom: '10px', color: '#333' }}>
                            Security Question
                        </Typography>
                        <Typography variant="body1">{formData.securityQuestion}</Typography>
                        <StyledTextField
                            name="answer"
                            label="Answer"
                            value={formData.answer}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            error={!!errors.answer}
                            helperText={errors.answer}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ marginBottom: '10px', color: '#333' }}>
                            Secret Key Verification
                        </Typography>
                        <Typography variant="body1">Enter the secret key you created during sign up.</Typography>
                        <StyledTextField
                            name="securityKey"
                            label="Security Key"
                            type="password"
                            value={formData.securityKey}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            error={!!errors.securityKey}
                            helperText={errors.securityKey}
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <BackgroundBox>
            <CardBox>
                <CustomStepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <CustomStep key={label}>
                            <CustomStepLabel>
                                <Box
                                    sx={{
                                        bgcolor: activeStep === steps.indexOf(label) ? '#ff6f61' : '#ffe5dc',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: activeStep === steps.indexOf(label) ? '#fff' : '#ff6f61',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                    }}
                                >
                                    {steps.indexOf(label) + 1}
                                </Box>
                            </CustomStepLabel>
                        </CustomStep>
                    ))}
                </CustomStepper>
                <Box mt={2}>
                    {renderStepContent(activeStep)}
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <StyledButton onClick={handleBack} variant="contained">
                            Back
                        </StyledButton>
                        {activeStep === 0 && (
                            <StyledButton onClick={redirectToSignUp} variant="contained">
                                New user? Sign up
                            </StyledButton>
                        )}
                        <StyledButton onClick={handleNext} variant="contained">
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </StyledButton>
                    </Box>
                </Box>

                {errors.apiError && (
                    <Typography color="error" variant="body2" sx={{ marginTop: '10px' }}>
                        {errors.apiError}
                    </Typography>
                )}
            </CardBox>
            <ImageBox />
            <ImageLeftBox />
        </BackgroundBox>
    );
};

export default Login;
