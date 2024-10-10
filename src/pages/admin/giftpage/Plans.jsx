import React, { useEffect, useState } from 'react';
import {
    Button, Modal, Box, TextField, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, TablePagination
} from '@mui/material'; // Import TablePagination here
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { addDocument, fetchDocuments, deleteDocument, updateDocument } from "../../../services/firebaseservice";
import ModalDelete from '../shares/ModalDelete';

// Style cho modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
};

const Plans = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [plan, setPlan] = useState({ level: '', title: '', priceOfMonth: '' });
    const [plans, setPlans] = useState([]);
    const [update, setUpdate] = useState(false);
    const [deletePlan, setDeletePlan] = useState(null);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchPlan, setSearchPlan] = useState("");
    const [errors, setErrors] = useState({
        level: '',
        title: '',
        priceOfMonth: ''
    });

    const fetchData = async () => {
        const plansData = await fetchDocuments('plans');
        console.log('Fetched plans:', plansData);
        setPlans(plansData);
    };

    useEffect(() => {
        fetchData();
    }, [update]);

    // Handle delete
    const handleDelete = async () => {
        console.log(deletePlan.id);
        
        if (deletePlan && deletePlan.id) {
            await deleteDocument("plans", deletePlan.id);
            setUpdate(!update);
            setOpenDelete(false);
        } else {
            console.error("Delete failed: Document ID is undefined or invalid");
        }
    };

    // Open add modal
    const handleOpenAdd = () => {
        setPlan({ level: '', title: '', priceOfMonth: '' });
        setOpenAdd(true);
    };

    // Open edit modal
    const handleOpenEdit = (plan) => {
        setPlan(plan);
        setOpenAdd(true);
        setErrors({});
    };

    // Close all modals
    const handleClose = () => {
        setOpenAdd(false);
        setOpenDelete(false);
    };

    const validation = () => {
        const newError = {};
        newError.level = plan.level ? "" : "Please enter level";
        newError.title = plan.title ? "" : "Please enter title";
        newError.priceOfMonth = plan.priceOfMonth ? "" : "Please enter price of month";
        setErrors(newError);
        return !newError.level && !newError.title && !newError.priceOfMonth;
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlan((prevPlan) => ({
            ...prevPlan,
            [name]: value,
        }));
    };

    // Submit (add/update) form
    const handleSubmitAdd = async (e) => {
        e.preventDefault();

        if (validation()) {
            if (plan.id) {
                const { id, ...newObject } = plan;
                await updateDocument("plans", plan.id, newObject);
            } else {
                await addDocument("plans", plan);
            }
            setPlan({ level: '', title: '', priceOfMonth: '' });
            handleClose();
            setUpdate(!update);
        }
    };

    // Filter plans based on search input
    const filteredPlans = plans.filter(pl =>
        pl.title.toLowerCase().includes(searchPlan.toLowerCase())
    );

    return (
        <div className='px-5'>
            <div className="flex justify-around items-center mt-5">
                <h1 className='text-3xl'>List of Plans</h1>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        fullWidth
                        onChange={(e) => setSearchPlan(e.target.value)}
                    />
                    <Button variant="contained" type="submit" color="primary">
                        Search
                    </Button>
                </Box>
                {/* Add button */}
                <Button variant="contained" onClick={handleOpenAdd}>
                    Add Plan
                </Button>
            </div>
            <TableContainer component={Paper} className='mt-5'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Price of Month</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPlans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((plan, index) => (
                            <TableRow key={plan.id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{plan.level}</TableCell>
                                <TableCell>{plan.title}</TableCell>
                                <TableCell>{plan.priceOfMonth}</TableCell>
                                <TableCell align="right">
                                    {/* Edit Button */}
                                    <IconButton color="primary" onClick={() => handleOpenEdit(plan)}>
                                        <EditIcon />
                                    </IconButton>
                                    {/* Delete Button */}
                                    <IconButton color="secondary" onClick={() => { setOpenDelete(true); setDeletePlan(plan); }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={plans.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>

            <ModalDelete setOpenDelete={setOpenDelete} openDelete={openDelete} handleDelete={handleDelete} />

            {/* Modal for Adding and Editing Plans */}
            <Modal open={openAdd} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {plan.id ? "Edit Plan" : "Add New Plan"}
                    </Typography>
                    <form onSubmit={handleSubmitAdd}>
                        <TextField
                            label="Level"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="level"
                            value={plan.level}
                            onChange={handleChange}
                            error={!!errors.level}
                            helperText={errors.level}
                        />
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="title"
                            value={plan.title}
                            onChange={handleChange}
                            error={!!errors.title}
                            helperText={errors.title}
                        />
                        <TextField
                            label="Price of Month"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="priceOfMonth"
                            value={plan.priceOfMonth}
                            onChange={handleChange}
                            error={!!errors.priceOfMonth}
                            helperText={errors.priceOfMonth}
                        />
                        <Box mt={2} textAlign="right">
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                                {plan.id ? "Update" : "Add"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>

        </div>
    );
};

export default Plans;
