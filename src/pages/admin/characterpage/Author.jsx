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

const Author = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [author, setAuthor] = useState({ name: '', description: '', dateofbirth: '' });
    const [authors, setAuthors] = useState([]);
    const [update, setUpdate] = useState(false);
    const [deleteauthor, setDeleteAuthor] = useState(null);
    const [page, setPage] = useState(0); // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchauthor, setSearchAuthor] = useState("");
    const [imgUpload, setImgUpload] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        description: ''
    });

    const fetchData = async () => {
        const authorsData = await fetchDocuments('authors');
        console.log('Fetched authors:', authorsData);
        setAuthors(authorsData);
    };

    useEffect(() => {
        fetchData();
    }, [update]);

    // Hàm xử lý xóa (delete)
    const handleDelete = async () => {
        if (deleteauthor) {
            await deleteDocument("authors", deleteauthor.id);
            setUpdate(!update);
            setOpenDelete(false);
        }
    };

    // Hàm để mở modal thêm
    const handleOpenAdd = () => {
        setAuthor({ name: '', description: '' });
        setOpenAdd(true);
        setOpen(true);
    };

    // Hàm để mở modal chỉnh sửa
    const handleOpenEdit = (author) => {
        setAuthor(author);
        setOpenAdd(true);
        setErrors({});
    };

    // Hàm để đóng tất cả các modal
    const handleClose = () => {
        setOpenAdd(false);
        setOpenDelete(false);
        setOpen(false);
    };

    const validation = () => {
        const newError = {};
        newError.name = author.name ? "" : "Please enter name";
        newError.description = author.description ? "" : "Please enter description";
        newError.dateofbirth = author.dateofbirth ? "" : "Please enter dateofbirth";
        setErrors(newError);
        return !newError.name && !newError.description;
    };

    // Hàm để xử lý khi input thay đổi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAuthor((prevAuthor) => ({
            ...prevAuthor,
            [name]: value,
        }));
    };
    console.log(searchauthor);

    // Hàm submit dữ liệu (thêm mới)
    const handleSubmitAdd = async (e) => {
        e.preventDefault();

        if (validation()) {
            if (author.id) {
                const { id, ...newObject } = author;
                await updateDocument("authors", author.id, newObject);
            } else {
                await addDocument("authors", author, imgUpload);
            }
            setAuthor({ name: '', description: '', dateofbirth: '' });
            handleClose();
            setUpdate(!update);
        }
    };
    // Lọc danh sách phòng theo giá trị tìm kiếm
    const filteredAuthor = authors.filter(at =>
        at.name.toLowerCase().includes(searchauthor.toLowerCase())
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
                <h1 className='text-3xl'>List author</h1>
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
                        onChange={(e) => setSearchAuthor(e.target.value)}
                    />
                    <Button variant="contained" type="submit" color="primary">
                        Search
                    </Button>
                </Box>
                {/* Nút để mở modal thêm */}
                <Button variant="contained" onClick={handleOpenAdd}>
                    Add author
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
                        {filteredAuthor.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((author, index) => (
                            <TableRow key={author.id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={author.imgUrl || "https://assets.glxplay.io/web/images/logoglx.svg"} // Display uploaded image or default
                                        alt={author.name}
                                        style={{ width: '50px', height: 'auto' }} // Style for image display
                                    />
                                </TableCell>
                                <TableCell>{author.name}</TableCell>
                                <TableCell>{author.dateofbirth}</TableCell>
                                <TableCell>{author.description}</TableCell>
                                <TableCell align="right">
                                    {/* Edit Button */}
                                    <IconButton color="primary" onClick={() => handleOpenEdit(author)}>
                                        <EditIcon />
                                    </IconButton>
                                    {/* Delete Button */}
                                    <IconButton color="secondary" onClick={() => { setOpenDelete(true); setDeleteAuthor(author); }}>
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
                    count={authors.length}
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

            {/* Modal for Adding and Editing Authors */}
            <Modal open={openAdd} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {author.id ? "Edit Author" : "Add New Author"}
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
                            value={author.name}
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
                            value={author.dateofbirth || ''} // Ensure value is initialized
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
                            value={author?.description || ''} // Ensure description is initialized properly
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
                                {author.id ? "Update" : "Add"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>

        </div>
    );
};

export default Author;
