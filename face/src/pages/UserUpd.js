import * as Yup from 'yup';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState, useRef, Component } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import {SessionContext, getSessionCookie, setSessionCookie} from '../session';


// material
import {
  Card,
  Table,
  Box,
  Link,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Stack,
  Avatar,
  Grid,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  MenuItem
} from '@material-ui/core';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { LoadingButton } from '@material-ui/lab';


import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------



export default function User() {
      const navigate = useNavigate();


  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required')
  });
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [showPassword, setShowPassword] = useState(false);

  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [region,setRegion] = useState('CENTRE');
  const [tableToUse,setTableToUse] = useState([]);

  const emptyRowsBis = page > 0 ? Math.max(0, (1 + page) * rowsPerPage) : 0;

  const filteredUsersBis = [];

  const isUserNotFoundBis = filteredUsersBis.length === 0;

  const [emptyRows,setEmptyRows] = useState(emptyRowsBis);
  const [filteredUsers, setFilteredUsers] = useState(filteredUsersBis);
  const [isUserNotFound,setIsUserNotFound] = useState(isUserNotFoundBis);



  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };


 const session = getSessionCookie();
const id = JSON.parse(session).id;
const token = JSON.parse(session).token;
const usernameUpd = JSON.parse(session).usernameUpd;
const firstNameUpd = JSON.parse(session).firstNameUpd;
const lastNameUpd = JSON.parse(session).lastNameUpd;
const roleUpd = JSON.parse(session).roleUpd;
  const formik = useFormik({
    initialValues: {
      email: usernameUpd,
      firstName : firstNameUpd,
      lastName : lastNameUpd,
      password: '',
      role: roleUpd,
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      fetch('http://127.0.0.1:4000/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token

        },
        body: JSON.stringify({"usernameUpd":usernameUpd, "roleUpd": roleUpd, "username":values.email,"password":values.password,"role":values.role,"firstName":values.firstName,"lastName":values.lastName})
      })
      .then(data => {
          navigate('/dashboard/user');
      });
      
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Page title="USERS | TRANSAC-CM">
      <Container>


        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            GESTION UTILISATEURS
          </Typography>
          
        </Stack>

        <br/>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Modifier  UTILISATEUR { usernameUpd }
          </Typography>
          
        </Stack>
      <div>
      <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="Email"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
           <TextField
            fullWidth
            autoComplete="FirstName"
            type="text"
            label="First Name"
            {...getFieldProps('firstName')}
            error={Boolean(touched.firstName && errors.firstName)}
            helperText={touched.firstName && errors.firstName}
          />
           <TextField
            fullWidth
            autoComplete="LastName"
            type="text"
            label="Last Name"
            {...getFieldProps('lastName')}
            error={Boolean(touched.lastName && errors.lastName)}
            helperText={touched.lastName && errors.lastName}
          />

          <TextField
            fullWidth
            autoComplete="Password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <TextField id="select" label="ROLE" value="ADMIN" {...getFieldProps('role')} select>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="OPERATOR">OPERATOR</MenuItem>
            <MenuItem value="REGION">REGION</MenuItem>
            <MenuItem value="DEPARTMENT">DEPARTMENT</MenuItem>

          </TextField>
        </Stack>
        <br/>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          MODIFIER UTILISATEUR
        </LoadingButton>
          </Form>
    </FormikProvider>
<br/>
</div>
     
      </Container>
    </Page>
  );
}
