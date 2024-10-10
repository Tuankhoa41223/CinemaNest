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

const Actor = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [actor, setActor] = useState({ name: '', description: '', dateofbirth: '' });
    const [actors, setActors] = useState([]);
    const [update, setUpdate] = useState(false);
    const [deleteactor, setDeleteActor] = useState(null);
    const [page, setPage] = useState(0); // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchactor, setSearchActor] = useState("");
    const [imgUpload, setImgUpload] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [errors, setErrors] = useState({
        name: '',
        description: ''
    });

    const fetchData = async () => {
        const actorsData = await fetchDocuments('actors');
        console.log('Fetched actors:', actorsData);
        setActors(actorsData);
    };

    useEffect(() => {
        fetchData();
    }, [update]);

    // Hàm xử lý xóa (delete)
    const handleDelete = async () => {
        if (deleteactor) {
            await deleteDocument("actors", deleteactor.id);
            setUpdate(!update);
            setOpenDelete(false);
        }
    };

    // Hàm để mở modal thêm
    const handleOpenAdd = () => {
        setActor({ name: '', description: '' });
        setPreviewImg(null);
        setOpenAdd(true);
    };

    // Hàm để mở modal chỉnh sửa
    const handleOpenEdit = (actor) => {
        setActor(actor);
        setPreviewImg(actor.imgUrl);
        setOpenAdd(true);
        setErrors({});
    };

    // Hàm để đóng tất cả các modal
    const handleClose = () => {
        setOpenAdd(false);
        setOpenDelete(false);
    };

    const validation = () => {
        const newError = {};
        newError.name = actor.name ? "" : "Please enter name";
        newError.description = actor.description ? "" : "Please enter description";
        newError.dateofbirth = actor.dateofbirth ? "" : "Please enter dateofbirth";
        setErrors(newError);
        return !newError.name && !newError.description;
    };

    // Hàm để xử lý khi input thay đổi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setActor((prevActor) => ({
            ...prevActor,
            [name]: value,
        }));
    };
   

    // Hàm submit dữ liệu (thêm mới)
    const handleSubmitAdd = async (e) => {
        e.preventDefault();

        if (validation()) {
            if (actor.id) {
                const { id, ...newObject } = actor;
                await updateDocument("actors", actor.id, newObject);
            } else {
                await addDocument("actors", actor, imgUpload);
            }
            setActor({ name: '', description: '', dateofbirth: '' });
            handleClose();
            setUpdate(!update);
        }
    };
    // Lọc danh sách phòng theo giá trị tìm kiếm
    const filteredActor = actors.filter(at =>
        at.name.toLowerCase().includes(searchactor.toLowerCase())
    );

    // Handle img Change
    const handleImageChange = (e) => {
        const selectedImg = e.target.files[0];

        if (selectedImg) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImg(reader.result);
            };
            reader.readAsDataURL(selectedImg);
            setImgUpload(selectedImg);
        } else {
            setPreviewImg(null);
            setImgUpload(null);
        }
    };



    return (
        <div className='px-5'>
            <div className="flex justify-around items-center mt-5">
                <h1 className='text-3xl'>List actor</h1>
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
                        onChange={(e) => setSearchActor(e.target.value)}
                    />
                    <Button variant="contained" type="submit" color="primary">
                        Search
                    </Button>
                </Box>
                {/* Nút để mở modal thêm */}
                <Button variant="contained" onClick={handleOpenAdd}>
                    Add actor
                </Button>
            </div>
            <TableContainer component={Paper} className='mt-5'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Img</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredActor.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((actor, index) => (
                            <TableRow key={actor.id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={actor.imgUrl || "https://assets.glxplay.io/web/images/logoglx.svg"} // Display uploaded image or default
                                        alt={actor.name}
                                        style={{ width: '50px', height: 'auto' }} // Style for image display
                                    />
                                </TableCell>
                                <TableCell>{actor.name}</TableCell>
                                <TableCell>{actor.dateofbirth}</TableCell>
                                <TableCell>{actor.description}</TableCell>
                                <TableCell align="right">
                                    {/* Edit Button */}
                                    <IconButton color="primary" onClick={() => handleOpenEdit(actor)}>
                                        <EditIcon />
                                    </IconButton>
                                    {/* Delete Button */}
                                    <IconButton color="secondary" onClick={() => { setOpenDelete(true); setDeleteActor(actor); }}>
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
                    count={actors.length}
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

            {/* Modal for Adding and Editing Actors */}
            <Modal open={openAdd} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {actor.id ? "Edit Actor" : "Add New Actor"}
                    </Typography>
                    <form onSubmit={handleSubmitAdd}>
                        {/* Error message for image upload */}
                        {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="name"
                            value={actor.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Date of Birth"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="dateofbirth"
                            type="date" // Set the input type to date
                            value={actor.dateofbirth || ''} // Ensure value is initialized
                            onChange={handleChange}
                            error={!!errors.dateofbirth}
                            helperText={errors.dateofbirth}
                            InputLabelProps={{
                                shrink: true, // This makes the label stay above the input when filled
                            }}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="description"
                            value={actor?.description || ''} // Ensure description is initialized properly
                            onChange={handleChange}
                            error={!!errors.description}
                            helperText={errors.description}
                            multiline // This makes the TextField behave like a textarea
                            rows={3} // Set the number of visible rows
                        />
                        {/* Image Upload Field */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <Box mt={2}>
                            <img
                                src={previewImg || "https://assets.glxplay.io/web/images/logoglx.svg"} // Use previewImg if available
                                style={{ width: '100%', maxWidth: '200px', height: 'auto' }} // Style for image display
                            />
                        </Box>
                        <Box mt={2} textAlign="right">
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                                {actor.id ? "Update" : "Add"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>

        </div>
    );
};

export default Actor;
