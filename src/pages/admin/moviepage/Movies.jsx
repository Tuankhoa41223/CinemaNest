import React, { useContext, useEffect, useState } from 'react';
import {
    Button, Modal, Box, TextField, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, TablePagination,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material'; // Import TablePagination here
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { addDocument, fetchDocuments, deleteDocument, updateDocument } from "../../../services/firebaseservice";
import ModalDelete from '../shares/ModalDelete';
import { ContextCategories } from "../../../context/CategoriesContext";
import { ContextAuthors } from '../../../context/AuthorsContext';
import ModalMovies from "./ModalMovies";

// Style cho modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    height: "95vh"
};

const Movie = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [movie, setMovie] = useState({ name: '', description: '', duration: '', authorId: '', categoryId: '', characterId: '' });
    const [movies, setMovies] = useState([]);
    const [update, setUpdate] = useState(false);
    const [deletemovie, setDeleteMovie] = useState(null);
    const [page, setPage] = useState(0); // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchmovie, setSearchMovie] = useState("");
    const [imgUpload, setImgUpload] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const categories = useContext(ContextCategories);
    const authors = useContext(ContextAuthors);
    console.log(authors);
    
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        description: ''
    });

    const fetchData = async () => {
        const moviesData = await fetchDocuments('movies');
        console.log('Fetched movies:', moviesData);
        setMovies(moviesData);
    };

    useEffect(() => {
        fetchData();
    }, [update]);

    // Hàm xử lý xóa (delete)
    const handleDelete = async () => {
        if (deletemovie) {
            await deleteDocument("movies", deletemovie.id);
            setUpdate(!update);
            setOpenDelete(false);
        }
    };

    // Hàm để mở modal thêm
    const handleOpenAdd = () => {
        setMovie({ name: '', description: '' });
        setPreviewImg(null);
        setOpenAdd(true);
    };

    // Hàm để mở modal chỉnh sửa
    const handleOpenEdit = (movie) => {
        setMovie(movie);
        setPreviewImg(movie.imgUrl);
        setOpenAdd(true);
    };

    // Hàm để đóng tất cả các modal
    const handleClose = () => {
        setOpenAdd(false);
        setOpenDelete(false);
    };

    // Hàm để đóng tất cả các modal
    const handleCloseActor = () => {
        setOpen(false);
    };

    const validation = () => {
        const newError = {};
        newError.name = movie.name ? "" : "Please enter name";
        newError.description = movie.description ? "" : "Please enter description";
        newError.duration = movie.duration ? "" : "Please enter duration";
        newError.authorId = movie.authorId ? "" : "Please enter authorId";
        newError.categoryId = movie.categoryId ? "" : "Please enter categoryId ";
        newError.characterId = movie.characterId ? "" : "Please enter characterId";
        setErrors(newError);
        return !newError.name && !newError.description;
    };

    // Hàm để xử lý khi input thay đổi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie((prevMovie) => ({
            ...prevMovie,
            [name]: value,
        }));
    };


    // Hàm submit dữ liệu (thêm mới)
    const handleSubmitAdd = async (e) => {
        e.preventDefault();

        if (validation()) {
            if (movie.id) {
                const { id, ...newObject } = movie;
                await updateDocument("movies", movie.id, newObject);
            } else {
                await addDocument("movies", movie, imgUpload);
            }
            setMovie({ name: '', description: '', duration: '', authorId: '', categoryId: '', characterId: '' });
            handleClose();
            setUpdate(!update);
        }
    };
    // Lọc danh sách phòng theo giá trị tìm kiếm
    const filteredMovie = movies.filter(at =>
        at.name.toLowerCase().includes(searchmovie.toLowerCase())
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
                <h1 className='text-3xl'>List movie</h1>
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
                        onChange={(e) => setSearchMovie(e.target.value)}
                    />
                    <Button variant="contained" type="submit" color="primary">
                        Search
                    </Button>
                </Box>
                {/* Nút để mở modal thêm */}
                <Button variant="contained" onClick={handleOpenAdd}>
                    Add Movie
                </Button>
            </div>
            <TableContainer component={Paper} className='mt-5'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Img</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>AuthorID</TableCell>
                            <TableCell>CategoryID</TableCell>
                            <TableCell>CharacterID</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMovie.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((movie, index) => (
                            <TableRow key={movie.id}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={movie.imgUrl || "https://assets.glxplay.io/web/images/logoglx.svg"} // Display uploaded image or default
                                        alt={movie.name}
                                        style={{ width: '50px', height: 'auto' }} // Style for image display
                                    />
                                </TableCell>
                                <TableCell>{movie.name}</TableCell>
                                <TableCell>{movie.description}</TableCell>
                                <TableCell>{movie.duration}</TableCell>
                                <TableCell>{movie.authorId}</TableCell>
                                <TableCell>{movie.categoryId}</TableCell>
                                <TableCell>{movie.characterId}</TableCell>
                                <TableCell align="right">
                                    {/* Edit Button */}
                                    <IconButton color="primary" onClick={() => handleOpenEdit(movie)}>
                                        <EditIcon />
                                    </IconButton>
                                    {/* Delete Button */}
                                    <IconButton color="secondary" onClick={() => { setOpenDelete(true); setDeleteMovie(movie); }}>
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
                    count={movies.length}
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

            {/* Modal for Adding and Editing Movies */}
            <Modal open={openAdd} onClose={handleClose}>
                <Box
                    sx={style}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        {movie.id ? "Edit Movie" : "Add New Movie"}
                    </Typography>
                    <form onSubmit={handleSubmitAdd}>
                        <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Box>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name="name"
                                    value={movie.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name="description"
                                    value={movie?.description || ''}
                                    onChange={handleChange}
                                    error={!!errors.description}
                                    helperText={errors.description}
                                    multiline
                                    rows={2}
                                />
                                <TextField
                                    label="Duration (in minutes)"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name="duration"
                                    value={movie.duration}
                                    onChange={handleChange}
                                    error={!!errors.duration}
                                />
                                {/* CategoryID as a Select Dropdown */}
                                <FormControl fullWidth margin="normal" error={!!errors.authorId}>
                                    <InputLabel id="author-select-label">AuthorID</InputLabel>
                                    <Select
                                        labelId="author-select-label"
                                        name="authorId"
                                        value={movie.authorId} // Assuming movie now has an authorId field
                                        onChange={handleChange}
                                    >
                                        {/* Replace this array with your actual authors */}
                                        {authors.map((author) => (
                                            <MenuItem key={author.id} value={author.id}>
                                                {author.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.authorId && <FormHelperText>{errors.authorId}</FormHelperText>}
                                </FormControl>
                                <Box>
                                    {/* Image Upload Field */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <Box mt={2}>
                                        <img
                                            src={previewImg || "https://assets.glxplay.io/web/images/logoglx.svg"}
                                            className='w-20'
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            <Box>
                                <Box>
                                    <InputLabel>
                                        Categories
                                    </InputLabel>
                                    <Button variant='contained' onClick={() => setOpen(true)}>
                                        Choose Categories
                                    </Button>
                                </Box>
                                <Box>
                                    <InputLabel>
                                        Actor
                                    </InputLabel>
                                    {/* Button to open the modal */}
                                    <Button variant="contained" onClick={() => setOpen(true)} >
                                        Choose Actor
                                    </Button>

                                    {/* Reusable modal with data */}
                                    <ModalMovies open={open} handleCloseActor={handleCloseActor} title="Actors" />
                                </Box>
                                <Box>
                                    <InputLabel>
                                        Character
                                    </InputLabel>
                                    <Button variant="contained" onClick={() => setOpen(true)}>
                                        Choose Character
                                    </Button>
                                    <ModalMovies open={open} handleCloseActor={handleCloseActor} title="Actors" />
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={2} textAlign="right">
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                                {movie.id ? "Update" : "Add"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>


        </div>
    );
};

export default Movie;
