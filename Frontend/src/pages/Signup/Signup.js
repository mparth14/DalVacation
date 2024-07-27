import React, { useState } from 'react';
import { Box, Button, Card, Step, StepLabel, Stepper, Tab, Tabs, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

// const ImageBox = styled(Box)({
//     position: 'absolute',
//     width: '30%',
//     height: '40%',
//     left: 0,
//     bottom: '10%',
//     backgroundImage: 'url(https://cdni.iconscout.com/illustration/premium/thumb/hotel-entrance-5224227-4357487.png?f=webp)',
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
// });

// const ImageLeftBox = styled(Box)({
//     position: 'absolute',
//     right: 0,
//     width: '30%',
//     height: '40%',
//     bottom: '10%',
//     marginRight: '20px',
//     backgroundImage: 'url(https://img.freepik.com/free-vector/organic-flat-new-normal-hotels-illustration_23-2148920365.jpg)',
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
// });


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

const Signup = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [userType, setUserType] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: ['', '', '', '', '', ''],
        favColor: '',
        favSports: '',
        cityBorn: '',
        securityKey: '',
    });

    const navigate = useNavigate();

    const redirectToSignIn = () => {
        navigate('/login');
    };

    const [errors, setErrors] = useState({});
    const steps = ['User Info', 'Verification Code', 'Security Questions', 'Secret Key'];

    const [apiSuccess, setApiSuccess] = useState(false);

    // const [securityQuestions, setSecurityQuestions] = useState({
    //     favoriteColor: '',
    //     cityBorn: '',
    //     favoriteSports: '',
    //   });

    const validate = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (activeStep === 0) {
            if (!formData.firstName.trim()) tempErrors.firstName = 'First Name is required';
            if (!formData.lastName.trim()) tempErrors.lastName = 'Last Name is required';
            if (!formData.email.trim()) tempErrors.email = 'Email is required';
            else if (!emailRegex.test(formData.email)) tempErrors.email = 'Invalid email format';
            if (!formData.password) tempErrors.password = 'Password is required';
            else if (
                formData.password.length < 8 ||
                !/[A-Z]/.test(formData.password) ||
                !/[a-z]/.test(formData.password) ||
                !/[0-9]/.test(formData.password) ||
                !/[~!@#$%^&*_\-+=`|(){}\[\]:;"'<>,.?\/]/.test(formData.password)
            ) {
                tempErrors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters';
            }
            if (formData.password !== formData.confirmPassword)
                tempErrors.confirmPassword = 'Passwords do not match';
        } else if (activeStep === 1) {
            if (formData.verificationCode.some((digit) => digit === ''))
                tempErrors.verificationCode = 'Verification code is required';
        } else if (activeStep === 2) {
            if (!formData.favColor.trim()) tempErrors.favColor = 'Favorite color is required';
            if (!formData.favSports.trim()) tempErrors.favSports = 'Favorite sport is required';
            if (!formData.cityBorn.trim()) tempErrors.cityBorn = 'City of birth is required';
        } else if (activeStep === 3) {
            if (!formData.securityKey.trim()) tempErrors.securityKey = 'Security key is required';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleNext = async () => {
        if (validate()) {

            // Make API call here
            if (activeStep === 0) {
                try {
                    const encodeBase64 = btoa(formData.password);

                    console.log("password" + encodeBase64);
                    console.log("email" + formData.email);
                    console.log("firstName" + formData.firstName);
                    console.log("lastName" + formData.lastName);
                    const response = await axios.post('https://pp7futon99.execute-api.us-east-1.amazonaws.com/dev/sign-up', {
                        email: formData.email,
                        password: encodeBase64,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        groupToAdd: userType === 0 ? 'registered-users' : 'property-agents',
                    });
                    console.log('Sign up successful: Unnati', response.statusCode + "   " + response.data.message);
                    let errorMessage = 'An error occurred while signing up the user.';
                    if (response.status === 200) {
                        setActiveStep((prevActiveStep) => prevActiveStep + 1);
                        setApiSuccess(true);
                        setErrors({ apiError: '' });
                    } else if (response.statusCode === 400) {
                        if (response.data.message === 'An account with this email already exists.') {
                            errorMessage = 'An account with this email already exists. Please use a different email address.';

                        } else {
                            errorMessage = 'Invalid input provided. Please check your input fields.';
                        }
                        setErrors({ apiError: errorMessage });
                        console.log(errorMessage + "    unnati")
                    }
                    else if (response.statusCode === 500) {
                        errorMessage = response.data.message || 'Internal Server error';
                        setErrors({ apiError: errorMessage });
                    } else {
                        let errorMessage = 'Signup failed. Please try again.';
                        if (response.data.message) {
                            errorMessage = response.data.message;
                        }
                        setErrors({ apiError: errorMessage });
                    }
                } catch (error) {
                    console.error('Error during sign up:', error.response ? error.response.data : error.message);
                    let errorMessage = 'An error occurred while signing up the user.';
                    setErrors({ apiError: errorMessage });
                }
            } else if (activeStep === 1) {
                try {
                    const response = await axios.post('https://pp7futon99.execute-api.us-east-1.amazonaws.com/dev/email-verification', {
                        // Provide necessary data for verification code API call
                        action: 'verifyVerificationCode',
                        email: formData.email,
                        verificationCode: formData.verificationCode.toString().replace(/,/g, ''),
                    });

                    console.log("Verification::" + response.data);
                    console.log("Verification::" + response.data.statusCode);

                    console.log("Verification::" + formData.verificationCode.toString().replace(/,/g, ''));
                    // Handle response from verification code API
                    if (response.status === 200) {
                        setActiveStep((prevActiveStep) => prevActiveStep + 1);
                        setApiSuccess(true);
                        setErrors({ apiError: '' });
                    } else {
                        let errorMessage = response.data.message || 'Verification failed.';
                        setErrors({ apiError: errorMessage });
                    }
                } catch (error) {
                    console.error('Error during verification:', error);
                    let errorMessage = 'An error occurred while verifying the code.';
                    setErrors({ apiError: errorMessage });
                }
            } else if (activeStep === 2) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else if (activeStep === 3) {
                try {
                    const response = await axios.post('https://pp7futon99.execute-api.us-east-1.amazonaws.com/dev/second-factor-auth', {
                        action: 'add',
                        body: {
                            email: formData.email,
                            favoriteColor: formData.favColor,
                            favoriteSports: formData.favSports,
                            cityBorn: formData.cityBorn,
                            secretKey: formData.securityKey,
                        },
                    });

                    console.log(response.data);
                    if (response.status === 200) {
                        setActiveStep((prevActiveStep) => prevActiveStep + 1);
                        setApiSuccess(true);
                        setErrors({ apiError: '' });
                    } else {
                        let errorMessage = response.data.message || 'Failed to store security details.';
                        setErrors({ apiError: errorMessage });
                    }
                } catch (error) {
                    console.error('Error during storing security details:', error);
                    let errorMessage = 'An error occurred while storing security details.';
                    setErrors({ apiError: errorMessage });
                }
            }
        }
    };

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

    const handleUserTypeChange = (event, newValue) => {
        setUserType(newValue);
    };

    const handleVerificationCodeChange = (e, index) => {
        const { value } = e.target;

        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newCode = [...formData.verificationCode];
            newCode[index] = value;
            setFormData((prevFormData) => ({
                ...prevFormData,
                verificationCode: newCode,
            }));

            const nextIndex = index + 1;
            if (nextIndex < formData.verificationCode.length) {
                const inputs = document.getElementsByName('verificationCode');
                if (inputs[nextIndex]) {
                    inputs[nextIndex].focus();
                }
            }
        }

        if (value.length === 0 && e.nativeEvent.inputType === 'deleteContentBackward') {
            const prevIndex = index - 1;
            if (prevIndex >= 0) {
                const inputs = document.getElementsByName('verificationCode');
                if (inputs[prevIndex]) {
                    inputs[prevIndex].focus();
                }
            }
        }

        if (value.trim() !== '') {
            let tempErrors = { ...errors };
            delete tempErrors.verificationCode;
            setErrors(tempErrors);
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                verificationCode: 'Verification code is required',
            }));
        }
    };

    const handleResendCode = async () => {
        try {
            const response = await axios.post('https://pp7futon99.execute-api.us-east-1.amazonaws.com/dev/email-verification', {
                action: 'sendVerificationCode',
                email: formData.email,
            });
            console.log('Verification code resent successfully:', response.data);
            setErrors({ apiError: 'Verification code resent successfully' });
        } catch (error) {
            console.error('Error during resending verification code:', error.response ? error.response.data : error.message);
            setErrors({ apiError: error.response ? error.response.data.message : 'An error occurred during resending verification code' });
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (

                    <Box >

                        <Tabs value={userType} onChange={handleUserTypeChange}>
                            <Tab label="Normal User" />
                            <Tab label="Agent" />
                        </Tabs>
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            style={{ marginTop: '10px' }}
                        />
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                        />
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box pt={2}>
                        <Typography variant="subtitle1" gutterBottom>
                            Enter the verification code sent to your email:
                        </Typography>
                        <Box style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            {formData.verificationCode.map((digit, index) => (
                                <StyledTextField
                                    key={index}
                                    variant="outlined"
                                    name="verificationCode"
                                    inputProps={{
                                        maxLength: 1,
                                        style: {
                                            width: '40px',
                                            height: '40px',
                                            textAlign: 'center',
                                            fontSize: '20px',
                                        },
                                    }}
                                    value={digit}
                                    onChange={(e) => handleVerificationCodeChange(e, index)}
                                    error={!!errors.verificationCode}
                                    helperText={errors.verificationCode}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </Box>
                        <Button variant="outlined" onClick={handleResendCode} style={{ marginTop: '10px' }}>
                            Resend Code
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <Box pt={2}>
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="Favorite Color"
                            name="favColor"
                            value={formData.favColor}
                            onChange={handleChange}
                            error={!!errors.favColor}
                            helperText={errors.favColor}
                        />
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="Favorite Sports"
                            name="favSports"
                            value={formData.favSports}
                            onChange={handleChange}
                            error={!!errors.favSports}
                            helperText={errors.favSports}
                        />
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="City Born"
                            name="cityBorn"
                            value={formData.cityBorn}
                            onChange={handleChange}
                            error={!!errors.cityBorn}
                            helperText={errors.cityBorn}
                        />
                    </Box>
                );
            case 3:
                return (
                    <Box pt={2}>
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="Security Key"
                            name="securityKey"
                            type="password"
                            value={formData.securityKey}
                            onChange={handleChange}
                            error={!!errors.securityKey}
                            helperText={errors.securityKey}
                        />
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <BackgroundBox>
            <CardBox>
                <Typography variant="body1" gutterBottom sx={{ textAlign: 'center', paddingBottom: '20px', color: 'black' }}>
                    Please fill out the form below to create your account.
                </Typography>
                <CustomStepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <CustomStep key={label}>
                            <CustomStepLabel>{label}</CustomStepLabel>
                        </CustomStep>
                    ))}
                </CustomStepper>
                <Box>
                    {activeStep === steps.length ? (
                        <Box
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px 0',
                            }}
                        >
                            <Typography variant="h5" gutterBottom style={{ color: 'black' }}>
                                Thank you for registering.
                            </Typography>
                            <Typography variant="subtitle1" style={{ color: 'black' }}>
                                You're now ready to use our services.
                            </Typography>
                            {/* <Button
                            variant="contained"
                            color="primary"
                            onClick={redirectToSignIn}

                        >
                           Let's Sign In
                        </Button> */}
                            <StyledButton onClick={redirectToSignIn} style={{ marginTop: '20px' }} color="primary" variant="contained">
                                Let's Login
                            </StyledButton>


                        </Box>
                    ) : (
                        <Box>
                            {renderStepContent(activeStep)}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <Button onClick={handleBack}>
                                    Back
                                </Button>
                                <StyledButton variant="contained" onClick={handleNext}>
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </StyledButton>
                            </Box>
                        </Box>
                    )}

                    {errors.apiError && (
                        <Typography color="error" variant="body2">
                            {errors.apiError}
                        </Typography>
                    )}
                </Box>
            </CardBox>
            <ImageBox />
            <ImageLeftBox />
        </BackgroundBox>
    );
};

export default Signup;
