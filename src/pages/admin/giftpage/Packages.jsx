import React, { useEffect, useState, useContext } from 'react';
import {
    Button, Modal, Box, TextField, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, TablePagination, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { addDocument, fetchDocuments, deleteDocument, updateDocument } from "../../../services/firebaseservice";
import ModalDelete from '../shares/ModalDelete';
import { ContextPlans } from '../../../context/PlanContext';

// Style for modal
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

const Packages = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [packageData, setPackageData] = useState({ planId: '', discount: '', time: '' });
    const [packages, setPackages] = useState([]);
    const [update, setUpdate] = useState(false);
    const [deletePackage, setDeletePackage] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchPackage, setSearchPackage] = useState("");
    const plans = useContext(ContextPlans);
    const [errors, setErrors] = useState({
        planId: '',
        discount: '',
        time: ''
    });

    const fetchData = async () => {
        const packagesData = await fetchDocuments('packages');
        console.log('Fetched packages:', packagesData);
        setPackages(packagesData);
    };

    useEffect(() => {
        fetchData();
    }, [update]);

    // Handle delete
    const handleDelete = async () => {
        if (deletePackage && deletePackage.id) {
            await deleteDocument("packages", deletePackage.id);
            setUpdate(!update);
            setOpenDelete(false);
        } else {
            console.error("Delete failed: Document ID is undefined or invalid");
        }
    };

    // Open add modal
    const handleOpenAdd = () => {
        setPackageData({ planId: '', discount: '', time: '' });
        setOpenAdd(true);
    };

    // Open edit modal
    const handleOpenEdit = (packageData) => {
        setPackageData(packageData);
        setOpenAdd(true);
        setErrors({});

    };

    // Close all modals
    const handleClose = () => {
        setOpenAdd(false);
        setOpenDelete(false);
    };

    const validation = (isEditMode = false) => {
    const newError = {};

    // Kiểm tra các trường chỉ nếu không phải trong chế độ chỉnh sửa
    if (!isEditMode) {
        newError.planId = packageData.planId ? "" : "Please enter ID Plan";
        newError.discount = packageData.discount ? "" : "Please enter discount";
        newError.time = packageData.time ? "" : "Please enter time";
    }

    setErrors(newError);
    return !newError.planId && !newError.discount && !newError.time;
};

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPackageData((prevPackage) => ({
            ...prevPackage,
            [name]: value,
        }));
    };

    // Submit (add/update) form
    const handleSubmitAdd = async (e) => {
        e.preventDefault();

        if (validation()) {
            if (packageData.id) {
                const { id, ...newObject } = packageData;
                await updateDocument("packages", packageData.id, newObject);
            } else {
                await addDocument("packages", packageData);
            }
            setPackageData({ planId: '', discount: '', time: '' });
            handleClose();
            setUpdate(!update);
        }
    };

    // Filter packages based on search input
    const filteredPackages = packages.filter(pkg =>
        pkg.discount?.toLowerCase().includes(searchPackage.toLowerCase())
    );
 const getPlanTitleById = (planId) => {
        const plan = plans.find(p => p.id === planId);
        return plan ? plan.title : 'Unknown Plan'; // Trả về title hoặc 'Unknown Plan' nếu không tìm thấy
    };

    return (
        <div className='px-5'>
            <div className="flex justify-around items-center mt-5">
                <h1 className='text-3xl'>List of Packages</h1>
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
                        onChange={(e) => setSearchPackage(e.target.value)}
                    />
                    <Button variant="contained" type="submit" color="primary">
                        Search
                    </Button>
                </Box>
                {/* Add button */}
                <Button variant="contained" onClick={handleOpenAdd}>
                    Add Package
                </Button>
            </div>
            <TableContainer component={Paper} className='mt-5'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Plan</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPackages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((packageData, index) => (
                            <TableRow key={packageData.id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{getPlanTitleById(packageData.planId)}</TableCell>
                                <TableCell>{packageData.discount}</TableCell>
                                <TableCell>{packageData.time}</TableCell>
                                <TableCell align="right">
                                    {/* Edit Button */}
                                    <IconButton color="primary" onClick={() => handleOpenEdit(packageData)}>
                                        <EditIcon />
                                    </IconButton>
                                    {/* Delete Button */}
                                    <IconButton color="secondary" onClick={() => { setOpenDelete(true); setDeletePackage(packageData); }}>
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
                    count={packages.length}
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

            {/* Modal for Adding and Editing Packages */}
            <Modal open={openAdd} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {packageData.id ? "Edit Package" : "Add New Package"}
                    </Typography>
                    <form onSubmit={handleSubmitAdd}>
                        <FormControl fullWidth margin="normal" error={!!errors.planId}>
                            <InputLabel id="plan-select-label">Plan</InputLabel>
                            <Select
                                labelId="plan-select-label"
                                name="planId"
                                value={packageData.planId}
                                onChange={handleChange}
                            >
                                {plans.map((plan) => (
                                    <MenuItem key={plan.id} value={plan.id}>
                                        {plan.title}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.planId && <FormHelperText>{errors.planId}</FormHelperText>}
                        </FormControl>

                        <TextField
                            label="Discount"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="discount"
                            value={packageData.discount}
                            onChange={handleChange}
                            error={!!errors.discount}
                            helperText={errors.discount}
                        />
                        <TextField
                            label="Time"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="time"
                            value={packageData.time}
                            onChange={handleChange}
                            error={!!errors.time}
                            helperText={errors.time}
                        />
                        <Box mt={2} textAlign="right">
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                                {packageData.id ? "Update" : "Add"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default Packages;
