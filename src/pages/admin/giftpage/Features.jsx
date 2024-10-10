import React, { useEffect, useState, useContext } from 'react'; // Thêm useContext vào đây
import {
    Button, Modal, Box, TextField, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, TablePagination,FormControl,InputLabel,Select,MenuItem,FormHelperText
} from '@mui/material'; // Import TablePagination here
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { addDocument, fetchDocuments, deleteDocument, updateDocument } from "../../../services/firebaseservice";
import ModalDelete from '../shares/ModalDelete';
import { ContextPlans } from '../../../context/PlanContext';

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

const Features = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [feature, setFeature] = useState({ planId: '', text: '', available: '' });
    const [features, setFeatures] = useState([]);
    const [update, setUpdate] = useState(false);
    const [deleteFeature, setDeleteFeature] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchFeature, setSearchFeature] = useState("");
    const plans = useContext(ContextPlans);
    const [errors, setErrors] = useState({
        planId: '',
        text: '',
        available: ''
    });

    const fetchData = async () => {
        const featuresData = await fetchDocuments('features');
        console.log('Fetched features:', featuresData);
        setFeatures(featuresData);
    };

    useEffect(() => {
        fetchData();
    }, [update]);

    // Handle delete
    const handleDelete = async () => {
        if (deleteFeature && deleteFeature.id) {
            await deleteDocument("features", deleteFeature.id);
            setUpdate(!update);
            setOpenDelete(false);
        } else {
            console.error("Delete failed: Document ID is undefined or invalid");
        }
    };

    // Open add modal
    const handleOpenAdd = () => {
        setFeature({ planId: '', text: '', available: '' });
        setOpenAdd(true);
    };

    // Open edit modal
    const handleOpenEdit = (feature) => {
        setFeature(feature);
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
        newError.planId = feature.planId ? "" : "Please enter ID Plan";
        newError.text = feature.text ? "" : "Please enter text";
        newError.available = feature.available ? "" : "Please enter availability status";
        setErrors(newError);
        return !newError.planId && !newError.text && !newError.available;
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeature((prevFeature) => ({
            ...prevFeature,
            [name]: value,
        }));
    };

    // Submit (add/update) form
    const handleSubmitAdd = async (e) => {
        console.log(feature.id);
        
        e.preventDefault();

        if (validation()) {
            if (feature.id) {
                const { id, ...newObject } = feature;
                await updateDocument("features", feature.id, newObject);
            } else {
                await addDocument("features", feature);
            }
            setFeature({ planId: '', text: '', available: '' });
            handleClose();
            setUpdate(!update);
        }
    };

    // Filter features based on search input
    const filteredFeatures = features.filter(feat =>
        feat.text?.toLowerCase().includes(searchFeature.toLowerCase())
    );

    const getPlanTitleById = (planId) => {
        const plan = plans.find(p => p.id === planId);
        return plan ? plan.title : 'Unknown Plan'; // Trả về title hoặc 'Unknown Plan' nếu không tìm thấy
    };

    return (
        <div className='px-5'>
            <div className="flex justify-around items-center mt-5">
                <h1 className='text-3xl'>List of Features</h1>
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
                        onChange={(e) => setSearchFeature(e.target.value)}
                    />
                    <Button variant="contained" type="submit" color="primary">
                        Search
                    </Button>
                </Box>
                {/* Add button */}
                <Button variant="contained" onClick={handleOpenAdd}>
                    Add Feature
                </Button>
            </div>
            <TableContainer component={Paper} className='mt-5'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Plan</TableCell>
                            <TableCell>Text</TableCell>
                            <TableCell>Available</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFeatures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((feature, index) => (
                            <TableRow key={feature.id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{getPlanTitleById(feature.planId)}</TableCell>
                                <TableCell>{feature.text}</TableCell>
                                <TableCell>{feature.available}</TableCell>
                                <TableCell align="right">
                                    {/* Edit Button */}
                                    <IconButton color="primary" onClick={() => handleOpenEdit(feature)}>
                                        <EditIcon />
                                    </IconButton>
                                    {/* Delete Button */}
                                    <IconButton color="secondary" onClick={() => { setOpenDelete(true); setDeleteFeature(feature); }}>
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
                    count={features.length}
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

            {/* Modal for Adding and Editing Features */}
            <Modal open={openAdd} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {feature.id ? "Edit Feature" : "Add New Feature"}
                    </Typography>   
                    <form onSubmit={handleSubmitAdd}>
                        <FormControl fullWidth margin="normal" error={!!errors.planId}>
                            <InputLabel id="plan-select-label">Plan</InputLabel>
                            <Select
                                labelId="plan-select-label"
                                name="planId" // Đảm bảo rằng tên trường là planId
                                value={feature.planId} // 
                                onChange={handleChange}
                            >
                                {/* Thay thế mảng này bằng danh sách kế hoạch thực tế của bạn */}
                                {plans.map((plan) => ( // Thay authors thành plans
                                    <MenuItem key={plan.id} value={plan.id}>
                                        {plan.title} {/* Thay author.name thành plan.title */}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.planId && <FormHelperText>{errors.planId}</FormHelperText>} {/* Cập nhật lỗi tương ứng */}
                        </FormControl>

                        <TextField
                            label="Text"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="text"
                            value={feature.text}
                            onChange={handleChange}
                            error={!!errors.text}
                            helperText={errors.text}
                        />
                        <TextField
                            label="Available"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="available"
                            value={feature.available}
                            onChange={handleChange}
                            error={!!errors.available}
                            helperText={errors.available}
                        />
                        <Box mt={2} textAlign="right">
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                                {feature.id ? "Update" : "Add"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>

        </div>
    );
};

export default Features;
