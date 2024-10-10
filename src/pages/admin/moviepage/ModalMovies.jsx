import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

// Style for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ModalMovies ({ open, handleCloseActor }) {
  return (
    <Modal
      open={open}
      onClose={handleCloseActor}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
       <Box className="grid grid-cols-4 gap-2 mb-3">
           <Box>
                <img src="https://tse1.mm.bing.net/th?id=OIP.wY6mB8NVun-FbsA-HCn0lwAAAA&pid=Api&P=0&h=220" alt="" />
           </Box>
           <Box>
                <img src="https://tse1.mm.bing.net/th?id=OIP.wY6mB8NVun-FbsA-HCn0lwAAAA&pid=Api&P=0&h=220" alt="" />
           </Box>
           <Box>
                <img src="https://tse1.mm.bing.net/th?id=OIP.wY6mB8NVun-FbsA-HCn0lwAAAA&pid=Api&P=0&h=220" alt="" />
           </Box>
           <Box>
                <img src="https://tse1.mm.bing.net/th?id=OIP.wY6mB8NVun-FbsA-HCn0lwAAAA&pid=Api&P=0&h=220" alt="" />
           </Box>
       </Box>
         
        {/* Add and Cancel Buttons */}
        <Box  sx={{ display:"flex", justifyContent:"end"}}>
          <Button variant="outlined" color="error" onClick={handleCloseActor}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" sx={{ marginLeft:"10px"}}  >
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalMovies;
