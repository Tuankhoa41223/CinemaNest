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

const AdminCategory = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [category, setCategory] = useState({ name: '', description: '' });
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [page, setPage] = useState(0); // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchCategory,setSearchCategory] = useState("");
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });

  const fetchData = async () => {
    const categoriesData = await fetchDocuments('categories');
    console.log('Fetched categories:', categoriesData);
    setCategories(categoriesData);
  };

  useEffect(() => {
    fetchData();
  }, [update]);

  // Hàm xử lý xóa (delete)
  const handleDelete = async () => {
    if (deleteCategory) {
      await deleteDocument("categories", deleteCategory.id);
      setUpdate(!update);
      setOpenDelete(false);
    }
  };

  // Hàm để mở modal thêm
  const handleOpenAdd = () => {
    setCategory({ name: '', description: '' });
    setOpenAdd(true);
  };

  // Hàm để mở modal chỉnh sửa
  const handleOpenEdit = (category) => {
    setCategory(category);
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
    newError.name = category.name.trim() ? "" : "Please enter name";
    newError.description = category.description.trim() ? "" : "Please enter description";
    setErrors(newError);
    return !newError.name && !newError.description;
  };

  // Hàm để xử lý khi input thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };
console.log(searchCategory);

  // Hàm submit dữ liệu (thêm mới)
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (validation()) {
      if (category.id) {
        const { id, ...newObject } = category;
        await updateDocument("categories", category.id, newObject);
      } else {
        await addDocument("categories", category);
      }
      setCategory({ name: '', description: '' });
      handleClose();
      setUpdate(!update);
    }
  };

  // Lọc danh sách phòng theo giá trị tìm kiếm
  const filteredCategories = categories.filter(cate => 
  cate.name.toLowerCase().includes(searchCategory.toLowerCase()));

  return (
    <div className='px-5'>
      <div className="flex justify-around items-center mt-5">
        <h1 className='text-3xl'>List Category</h1>
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
            onChange={(e) => setSearchCategory(e.target.value)}
          />
          <Button variant="contained" type="submit" color="primary">
            Search
          </Button>
        </Box>
        {/* Nút để mở modal thêm */}
        <Button variant="contained" onClick={handleOpenAdd}>
          Add Category
        </Button>
      </div>
      <TableContainer component={Paper} className='mt-5'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category, index) => (
              <TableRow key={index}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{category?.name}</TableCell>
                <TableCell>{category?.description}</TableCell>
                <TableCell align="right">
                  {/* Nút Edit */}
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEdit(category)}
                  >
                    <EditIcon />
                  </IconButton>

                  {/* Nút Delete */}
                  <IconButton
                    color="secondary"
                    onClick={() => { setOpenDelete(true); setDeleteCategory(category); }}
                  >
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
          count={categories.length}
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

      {/* Modal Add */}
      <Modal open={openAdd} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            {category.id ? "Edit Category" : "Add New Category"}
          </Typography>
          <form onSubmit={handleSubmitAdd}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={category.name}
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
              value={category.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
            <Box mt={2} textAlign="right">
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                {category.id ? "Update" : "Add"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminCategory;
