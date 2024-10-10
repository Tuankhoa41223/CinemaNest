// src/services/firebaseService.js
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { v4 as uuidv4 } from "uuid";

// Fetch all documents from a given collection
export const fetchDocuments = async (collectionName) => {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    const documents = [];
    querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
};

// Thêm tài liệu mới vào một bộ sưu tập cụ thể với tùy chọn tải lên hình ảnh
export const addDocument = async (collectionName, values, imgUpload) => {
    try {
        if (imgUpload) {
            const storageRef = ref(storage, `${collectionName}/${uuidv4()}`);
            await uploadBytes(storageRef, imgUpload);
            const imgUrl = await getDownloadURL(storageRef);
            values.imgUrl = imgUrl; // Lưu URL vào đối tượng values
            console.log(values);
        }
        await addDoc(collection(db, collectionName), values);
    } catch (error) {
        console.error('Error adding document:', error);
        throw error;
    }
};

// Update a document in a given collection with an optional image upload
export const updateDocument = async (collectionName, docId, values, imgUpload, oldImgUrl) => {
    if (imgUpload) {
        const storageRef = ref(storage, `${collectionName}/${uuidv4()}`);
        await uploadBytes(storageRef, imgUpload);
        const imgUrl = await getDownloadURL(storageRef);
        values.imgUrl = imgUrl;

        // Delete the old image if it exists
        if (oldImgUrl) {
            const oldFilename = oldImgUrl.split('%2F').pop().split('?').shift();
            const oldImgRef = ref(storage, `${collectionName}/${oldFilename}`);
            await deleteObject(oldImgRef);
        }
    }
    await updateDoc(doc(collection(db, collectionName), docId), values);
};

// Delete a document from a given collection and its associated image
export const deleteDocument = async (collectionName, docId, imgUrl) => {
    await deleteDoc(doc(collection(db, collectionName), docId));

    // Delete the associated image if it exists
    if (imgUrl) {
        const filename = imgUrl.split('%2F').pop().split('?').shift();
        const imgRef = ref(storage, `${collectionName}/${filename}`);
        await deleteObject(imgRef);
    }
};

// Hàm để đăng ký một bộ sưu tập và gọi lại một callback với dữ liệu mới
export const subscribeToCollection = (collectionName, callback) => {
    const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
      const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(newData);
    });
    return unsubscribe; // Trả về hàm unsubscribe để dọn dẹp
};