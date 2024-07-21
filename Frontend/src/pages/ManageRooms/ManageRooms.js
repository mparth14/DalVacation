// import React, { useState } from 'react';
// import { useRooms } from '../../contexts/RoomContext';
// import RoomCard from '../../components/RoomCard/RoomCard';

// const ManageRooms = () => {
//     const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
//     const [newRoom, setNewRoom] = useState({
//         about: '',
//         booked_dates: [],
//         facilities: [],
//         max_guests: '',
//         no_of_baths: '',
//         no_of_beds: '',
//         price: '',
//         room_name: '',
//         room_type: ''
//     });
//     const [editingRoom, setEditingRoom] = useState(null);

//     const handleAddRoom = async () => {
//         const roomToAdd = { ...newRoom, id: rooms.length + 1 };
//         await addRoom(roomToAdd);
//         setNewRoom({
//             about: '',
//             booked_dates: [],
//             facilities: [],
//             max_guests: '',
//             no_of_baths: '',
//             no_of_beds: '',
//             price: '',
//             room_name: '',
//             room_type: ''
//         });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setNewRoom({ ...newRoom, [name]: value });
//     };

//     const handleEditChange = (e) => {
//         const { name, value } = e.target;
//         setEditingRoom({ ...editingRoom, [name]: value });
//     };

//     const handleUpdateRoom = async () => {
//         if (editingRoom) {
//             await updateRoom(editingRoom);
//             setEditingRoom(null);
//         }
//     };

//     const startEditing = (room) => {
//         setEditingRoom(room);
//     };

//     const handleDeleteRoom = async (roomId) => {
//         const confirmDelete = window.confirm('Are you sure you want to delete this room?');
//         if (confirmDelete) {
//             await deleteRoom(roomId);
//         }
//     };

//     return (
//         <div className="container">
//             <h1>Manage Rooms</h1>
//             <div>
//                 <h2>Add Room</h2>
//                 <div className="form-group">
//                     <input
//                         type="text"
//                         name="about"
//                         value={newRoom.about}
//                         onChange={handleChange}
//                         placeholder="About"
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="text"
//                         name="facilities"
//                         value={newRoom.facilities}
//                         onChange={handleChange}
//                         placeholder="Facilities (comma separated)"
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="number"
//                         name="max_guests"
//                         value={newRoom.max_guests}
//                         onChange={handleChange}
//                         placeholder="Max Guests"
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="number"
//                         name="no_of_baths"
//                         value={newRoom.no_of_baths}
//                         onChange={handleChange}
//                         placeholder="Number of Baths"
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="number"
//                         name="no_of_beds"
//                         value={newRoom.no_of_beds}
//                         onChange={handleChange}
//                         placeholder="Number of Beds"
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="number"
//                         name="price"
//                         value={newRoom.price}
//                         onChange={handleChange}
//                         placeholder="Price"
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="text"
//                         name="room_name"
//                         value={newRoom.room_name}
//                         onChange={handleChange}
//                         placeholder="Room Name"
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="text"
//                         name="room_type"
//                         value={newRoom.room_type}
//                         onChange={handleChange}
//                         placeholder="Room Type"
//                     />
//                 </div>
//                 <button onClick={handleAddRoom}>Add Room</button>
//             </div>
//             <div>
//                 <h2>Existing Rooms</h2>
//                 <div className="room-list">
//                     {rooms.map(room => (
//                         <div key={room.room_id}>
//                             <RoomCard room={room} />
//                             <button onClick={() => startEditing(room)}>Edit</button>
//                             <button onClick={() => handleDeleteRoom(room.room_id)}>Delete</button>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             {editingRoom && (
//                 <div>
//                     <h2>Edit Room</h2>
//                     <div className="form-group">
//                         <input
//                             type="text"
//                             name="about"
//                             value={editingRoom.about}
//                             onChange={handleEditChange}
//                             placeholder="About"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <input
//                             type="text"
//                             name="facilities"
//                             value={editingRoom.facilities}
//                             onChange={handleEditChange}
//                             placeholder="Facilities (comma separated)"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <input
//                             type="number"
//                             name="max_guests"
//                             value={editingRoom.max_guests}
//                             onChange={handleEditChange}
//                             placeholder="Max Guests"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <input
//                             type="number"
//                             name="no_of_baths"
//                             value={editingRoom.no_of_baths}
//                             onChange={handleEditChange}
//                             placeholder="Number of Baths"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <input
//                             type="number"
//                             name="no_of_beds"
//                             value={editingRoom.no_of_beds}
//                             onChange={handleEditChange}
//                             placeholder="Number of Beds"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <input
//                             type="number"
//                             name="price"
//                             value={editingRoom.price}
//                             onChange={handleEditChange}
//                             placeholder="Price"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <input
//                             type="text"
//                             name="room_name"
//                             value={editingRoom.room_name}
//                             onChange={handleEditChange}
//                             placeholder="Room Name"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <input
//                             type="text"
//                             name="room_type"
//                             value={editingRoom.room_type}
//                             onChange={handleEditChange}
//                             placeholder="Room Type"
//                         />
//                     </div>
//                     <button onClick={handleUpdateRoom}>Update Room</button>
//                 </div>
//             )}
//         </div>
//     );
// };
                            
// export default ManageRooms;



import React, { useState } from 'react';
import { useRooms } from '../../contexts/RoomContext';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import RoomCard from '../../components/RoomCard/RoomCard';
import './ManageRooms.css';

const ManageRooms = () => {
    const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
    const [newRoom, setNewRoom] = useState({
        room_name: '',
        room_type: '',
        about: '',
        facilities: [],
        max_guests: '',
        no_of_baths: '',
        no_of_beds: '',
        price: ''
    });
    const [editingRoom, setEditingRoom] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

    const handleAddRoom = async () => {
        const roomToAdd = { ...newRoom, id: rooms.length + 1 };
        await addRoom(roomToAdd);
        setNewRoom({
            room_name: '',
            room_type: '',
            about: '',
            facilities: [],
            max_guests: '',
            no_of_baths: '',
            no_of_beds: '',
            price: '',
        });
        setOpenModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRoom({ ...newRoom, [name]: value });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingRoom({ ...editingRoom, [name]: value });
    };

    const handleUpdateRoom = async () => {
        if (editingRoom) {
            await updateRoom(editingRoom);
            setEditingRoom(null);
            setOpenModal(false);
        }
    };

    const startEditing = (room) => {
        const facilitiesArray = Array.isArray(room.facilities) ? room.facilities : room.facilities.split(',').map(facility => facility.trim());
        setEditingRoom({ ...room, facilities: facilitiesArray });
        setModalMode('edit');
        setOpenModal(true);
    };
    
    const handleDeleteRoom = async (roomId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this room?');
        if (confirmDelete) {
            await deleteRoom(roomId);
        }
    };

    return (
        <div className="container">
            <Button
                variant="contained"
                color="primary"
                className="add-room-button"
                onClick={() => { setModalMode('add'); setOpenModal(true); }}
            >
                Add Room
            </Button>
            <h1>Manage Rooms</h1>
            <div className="room-list">
                {rooms.map(room => (
                    <div key={room.room_id} className="room-card-container">
                        <RoomCard room={room} />
                        <Button variant="contained" color="secondary" onClick={() => startEditing(room)}>
                            Edit
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleDeleteRoom(room.room_id)}>
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box className="modal-content">
                    <Typography id="modal-title" variant="h6" component="h2">
                        {modalMode === 'add' ? 'Add Room' : 'Edit Room'}
                    </Typography>
                    <form noValidate autoComplete="off">
                        <TextField
                            label="Room Name"
                            name="room_name"
                            value={modalMode === 'add' ? newRoom.room_name : editingRoom.room_name}
                            onChange={modalMode === 'add' ? handleChange : handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Room Type"
                            name="room_type"
                            value={modalMode === 'add' ? newRoom.room_type : editingRoom.room_type}
                            onChange={modalMode === 'add' ? handleChange : handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="About"
                            name="about"
                            value={modalMode === 'add' ? newRoom.about : editingRoom.about}
                            onChange={modalMode === 'add' ? handleChange : handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Facilities"
                            name="facilities"
                            value={modalMode === 'add' ? newRoom.facilities.join(', ') : (Array.isArray(editingRoom.facilities) ? editingRoom.facilities.join(', ') : '')}
                            onChange={modalMode === 'add' ? handleChange : handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Max Guests"
                            type="number"
                            name="max_guests"
                            value={modalMode === 'add' ? newRoom.max_guests : editingRoom.max_guests}
                            onChange={modalMode === 'add' ? handleChange : handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Number of Baths"
                            type="number"
                            name="no_of_baths"
                            value={modalMode === 'add' ? newRoom.no_of_baths : editingRoom.no_of_baths}
                            onChange={modalMode === 'add' ? handleChange : handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Number of Beds"
                            type="number"
                            name="no_of_beds"
                            value={modalMode === 'add' ? newRoom.no_of_beds : editingRoom.no_of_beds}
                            onChange={modalMode === 'add' ? handleChange : handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Price"
                            type="number"
                            name="price"
                            value={modalMode === 'add' ? newRoom.price : editingRoom.price}
                            onChange={modalMode === 'add' ? handleChange : handleEditChange}
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="primary" onClick={modalMode === 'add' ? handleAddRoom : handleUpdateRoom}>
                                {modalMode === 'add' ? 'Add Room' : 'Update Room'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ManageRooms;
