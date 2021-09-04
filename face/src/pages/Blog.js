import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useFormik, Form, FormikProvider } from 'formik';

import React, { useEffect, useState, useRef, Component } from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import axios from "axios";
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
  CircularProgress
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

// components
import Page from '../components/Page';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../components/_dashboard/blog';
//
import POSTS from '../_mocks_/blog';

import {SessionContext, getSessionCookie} from '../session';

import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'operator', label: 'OPERATOR', alignRight: false },
  { id: 'value', label: 'AMOUNT', alignRight: false },
  { id: 'records', label: 'RECORDS', alignRight: false },
  { id: 'createdDate', label: 'PROCESSED-t', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired
};


const rowsPerPage = 10;



export default function Blog() {
    const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState();
  const [progress, setProgress] = useState(0);


  const changeHandler = (event) => {
    console.log("Change occured");
    if (event.target.files[0].size > 1024*1024*4)
      alert('File size cannot exceed 4GB');
    else setSelectedFile(event.target.files[0]);
  };
  const [page, setPage] = useState(0);
 // const [rowsPerPage, setRowsPerPage] = useState(100);
  const [tableToUse,setTableToUse] = useState([]);

  const emptyRowsBis = page > 0 ? Math.max(0, (1 + page) * rowsPerPage) : 0;

  const filteredUsersBis = [];

  const isUserNotFoundBis = filteredUsersBis.length === 0;

  const [emptyRows,setEmptyRows] = useState(emptyRowsBis);
  const [filteredUsers, setFilteredUsers] = useState(filteredUsersBis);
  const [isUserNotFound,setIsUserNotFound] = useState(isUserNotFoundBis);

  useEffect (() => {
    async function renderTable(id,token,ser,sef,setis,settable,page){
      fetch('http://127.0.0.1:4000/transactions/allRecords/'+id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        }
     })
      .then(records => records.json())
      .then(records => {
          
      settable(records);
      const emptyRowsBisl = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - records.length) : 0;
      const filteredUsersBisl = records;
      const isUserNotFoundBisl = filteredUsersBisl.length === 0;

      ser(emptyRowsBisl);
      sef(filteredUsersBisl);
      setis(isUserNotFoundBisl);
  });
}
    renderTable(id,token,setEmptyRows,setFilteredUsers,setIsUserNotFound,setTableToUse,page);
  },[tableToUse,emptyRows,filteredUsers,isUserNotFound]);

  const session = getSessionCookie();
const id = JSON.parse(session).id;
const token = JSON.parse(session).token;
const [errorMsg, showErr] = useState(false);
const [niceMsg, showNice] = useState(false);
const [messageReturn, setMsgReturn] = useState("");

 async function reload(id,token,ser,sef,setis,settable,page){
      fetch('http://127.0.0.1:4000/transactions/allRecords/'+id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        }
     })
      .then(records => records.json())
      .then(records => {
          
      settable(records);
      const emptyRowsBisl = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - records.length) : 0;
      const filteredUsersBisl = records;
      const isUserNotFoundBisl = filteredUsersBisl.length === 0;

      ser(emptyRowsBisl);
      sef(filteredUsersBisl);
      setis(isUserNotFoundBisl);
  });
}

const handleSubmit = () => {
      let data = new FormData();
      console.log("sumitting");
      data.append('File',selectedFile);
      console.log(selectedFile);
      axios.request({
        url: 'http://127.0.0.1:4000/transactions/saveOccurence/'+id,
        method: 'POST',
        headers: {
          'Content-Type': "multipart/form-data",
          'Authorization' : 'Bearer '+token
        },
        data: data,
        onUploadProgress: p => {
            setProgress(Math.round((100 * p.loaded) / p.total));
        }
      })
      .then(data => data.json())
      .then(res => {
        console.log(res.message);
        if(!res.message.includes("Error")) {
          setMsgReturn(res.message);
          showNice(true);
          showErr(false);
          //navigate('/dashboard/blog',{ replace: true });
          reload(id,token,setEmptyRows,setFilteredUsers,setIsUserNotFound,setTableToUse,page);
        } else {
          setMsgReturn(res.message);
          showErr(true);
          showNice(false);
        }
      });
      
    };
  

  const [filterName, setFilterName] = useState('');
 
  return (
    <Page title="Dashboard: Upload Transactions | Transac-CM">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            View past and upload new transactions
          </Typography>
          
        </Stack>
        <div>

    { errorMsg && <h4 style={{color:"red"}}> {messageReturn} </h4> }
    { niceMsg && <h4 style={{color:"green"}}> {messageReturn} </h4> }

    <form>
        <Stack spacing={3}>
          <input
            name="fileSend"
            type="file"
            id="fileSend"
            label="Upload a transaction file"
            required="true"
            onChange={changeHandler} 
          />  
        {progress && <CircularProgressWithLabel value={progress} />}
  
        </Stack>


        <button
          size="large"
          variant="contained"
          onClick={handleSubmit}
        >
          Upload
        </button>
      </form>
      <br/>
      <Typography variant="h5" gutterBottom>
            Past Transactions
      </Typography>
   
    </div>

     <Scrollbar>
            <TableContainer sx={{ minWidth: 1000 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                  rowCount={tableToUse.length}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { operator, value, records, createdDate } = row;

                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell padding="checkbox">
                            <Checkbox/>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">                             
                                {operator}
                          </TableCell>
                          <TableCell align="left">{value}</TableCell>
                          <TableCell align="left">{records}</TableCell>
                          <TableCell align="left">
                            {createdDate}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

      </Container>
    </Page>
  );
}
