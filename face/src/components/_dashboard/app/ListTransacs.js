import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// components
import Page from '../../Page';
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';
import SearchNotFound from '../../SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../_dashboard/user';
//
import USERLIST from '../../../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'operator', label: 'OPERATOR', alignRight: false },
  { id: 'schoolname', label: 'SCHOOL', alignRight: false },
  { id: 'value', label: 'AMOUNT', alignRight: false },
  { id: 'region', label: 'REGION', alignRight: false },
  { id: 'department', label: 'DEPARTMENT', alignRight: false },
  { id: 'timestamp', label: 'DATETIME', alignRight: false },
  { id: 'createdDate', label: 'PROCESSED-t', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.schoolname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User(params) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableToUse,setTableToUse] = useState(USERLIST);



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tableToUse.map((n) => n.schoolname);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };



  const emptyRowsBis = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsersBis = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFoundBis = filteredUsersBis.length === 0;

  const [emptyRows,setEmptyRows] = useState(emptyRowsBis);
  const [filteredUsers, setFilteredUsers] = useState(filteredUsersBis);
  const [isUserNotFound,setIsUserNotFound] = useState(isUserNotFoundBis);

  useEffect (() => {
    async function renderTable(id,token){
      fetch('http://127.0.0.1:4000/schools/mine?userId='+id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        }
     })
      .then(schools => schools.json())
      .then(schools => {
          console.log("schools:" +JSON.stringify(schools));

          //Get schools ids
         fetch('http://127.0.0.1:4000/transactions/all/'+id,{
          method : 'GET',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer '+token 
          }
         }).then(transacs => transacs.json())
         .then( transacs => {
      setTableToUse(transacs);
      const emptyRowsBisl = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
      const filteredUsersBisl = applySortFilter(transacs, getComparator(order, orderBy), filterName);
      const isUserNotFoundBisl = filteredUsersBisl.length === 0;

      setEmptyRows(emptyRowsBisl);
      setFilteredUsers(filteredUsersBisl);
      setIsUserNotFound(isUserNotFoundBisl);

    });
  });
    }
    renderTable(params.id,params.token);
  },[tableToUse,emptyRows,filteredUsers,isUserNotFound]);

  return (          
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 1000 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableToUse.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, operator, schoolname, value, region, department, timestamp, createdDate } = row;
                      const isItemSelected = selected.indexOf(schoolname) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, schoolname)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">                             
                                {operator}
                             
                          </TableCell>
                          <TableCell align="left">{schoolname}</TableCell>
                          <TableCell align="left">{value}</TableCell>
                          <TableCell align="left">{region}</TableCell>
                          <TableCell align="left">
                            {department}
                          </TableCell>
                          <TableCell align="left">
                            {timestamp}
                          </TableCell>
                          <TableCell align="left">
                            {createdDate}
                          </TableCell>

                          <TableCell align="right">
                            <UserMoreMenu />
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableToUse.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
  );
}
