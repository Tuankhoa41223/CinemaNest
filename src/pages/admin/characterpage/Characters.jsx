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

const Characters = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [character, setcharacter] = useState({ name: '', description: '', dateofbirth: '' });
    const [characters, setCharacters] = useState([]);
    const [update, setUpdate] = useState(false);
    const [deletecharacter, setDeletecharacter] = useState(null);
    const [page, setPage] = useState(0); // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchcharacter, setSearchcharacter] = useState("");
    const [imgUpload, setImgUpload] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [errors, setErrors] = useState({
        name: '',
        description: ''
    });

    const fetchData = async () => {
        const charactersData = await fetchDocuments('characters');
        console.log('Fetched characters:', charactersData);
        setCharacters(charactersData);
    };

    useEffect(() => {
        fetchData();
    }, [update]);

    // Hàm xử lý xóa (delete)
    const handleDelete = async () => {
        if (deletecharacter) {
            await deleteDocument("characters", deletecharacter.id);
            setUpdate(!update);
            setOpenDelete(false);
        }
    };

    // Hàm để mở modal thêm
    const handleOpenAdd = () => {
        setcharacter({ name: '', description: '' });
        setOpenAdd(true);
    };

    // Hàm để mở modal chỉnh sửa
    const handleOpenEdit = (character) => {
        setcharacter(character);
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
        newError.name = character.name ? "" : "Please enter name";
        newError.description = character.description ? "" : "Please enter description";
        newError.dateofbirth = character.dateofbirth ? "" : "Please enter dateofbirth";
        setErrors(newError);
        return !newError.name && !newError.description;
    };

    // Hàm để xử lý khi input thay đổi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setcharacter((prevcharacter) => ({
            ...prevcharacter,
            [name]: value,
        }));
    };
    console.log(searchcharacter);

    // Hàm submit dữ liệu (thêm mới)
    const handleSubmitAdd = async (e) => {
        e.preventDefault();

        if (validation()) {
            if (character.id) {
                const { id, ...newObject } = character;
                await updateDocument("characters", character.id, newObject);
            } else {
                await addDocument("characters", character, imgUpload);
            }
            setcharacter({ name: '', description: '', dateofbirth: '' });
            handleClose();
            setUpdate(!update);
        }
    };
    // Lọc danh sách phòng theo giá trị tìm kiếm
    const filteredCharacter= characters.filter(at =>
        at.name.toLowerCase().includes(searchcharacter.toLowerCase())
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
                <h1 className='text-3xl'>List character</h1>
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
                        onChange={(e) => setSearchcharacter(e.target.value)}
                    />
                    <Button variant="contained" type="submit" color="primary">
                        Search
                    </Button>
                </Box>
                {/* Nút để mở modal thêm */}
                <Button variant="contained" onClick={handleOpenAdd}>
                    Add character
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
                        {filteredCharacter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((character, index) => (
                            <TableRow key={character.id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={character.imgUrl || "https://assets.glxplay.io/web/images/logoglx.svg"} // Display uploaded image or default
                                        alt={character.name}
                                        style={{ width: '50px', height: 'auto' }} // Style for image display
                                    />
                                </TableCell>
                                <TableCell>{character.name}</TableCell>
                                <TableCell>{character.dateofbirth}</TableCell>
                                <TableCell>{character.description}</TableCell>
                                <TableCell align="right">
                                    {/* Edit Button */}
                                    <IconButton color="primary" onClick={() => handleOpenEdit(character)}>
                                        <EditIcon />
                                    </IconButton>
                                    {/* Delete Button */}
                                    <IconButton color="secondary" onClick={() => { setOpenDelete(true); setDeletecharacter(character); }}>
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
                    count={characters.length}
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

            {/* Modal for Adding and Editing Characters */}
            <Modal open={openAdd} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {character.id ? "Edit character" : "Add New character"}
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
                            value={character.name}
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
                            value={character.dateofbirth || ''} // Ensure value is initialized
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
                            value={character?.description || ''} // Ensure description is initialized properly
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
                                {character.id ? "Update" : "Add"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>

        </div>
    );
};

export default Characters ;
