const firebaseConfig = {
  apiKey: "AIzaSyANjYDMNHYi-mCr149d2rl1w5LrTVygIUs",
  authDomain: "devto-1df94.firebaseapp.com",
  databaseURL: "https://devto-1df94-default-rtdb.firebaseio.com",
  projectId: "devto-1df94",
  storageBucket: "devto-1df94.appspot.com",
  messagingSenderId: "247008717268",
  appId: "1:247008717268:web:a88505d2f9538d41444e41",
  measurementId: "G-PSQY84KVLV"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();
document.addEventListener('DOMContentLoaded', function() {
  const publishBtn = document.querySelector('.publish-btn');
  const addCoverImageButton = document.getElementById('add-cover-image-btn');
  const coverImageInput = document.getElementById('coverImageInput');
  const fileInput = document.getElementById('coverImageInput');
  const storage = firebase.storage();

  addCoverImageButton.addEventListener('click', function() {
    coverImageInput.click();
  });

  fileInput.addEventListener('change', handleFileSelect);

  publishBtn.addEventListener('click', function() {
    if (fileInput.files.length > 0) {
      uploadImage(fileInput.files[0]);
    } else {
      publishPost('');
    }
  });

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const src = e.target.result;
        const imagePreviewContainer = document.getElementById('image-preview-container');
        imagePreviewContainer.innerHTML = '';  
        
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('image-preview');
        
        imagePreviewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }
  

  function uploadImage(file) {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`images/${file.name}`);
    fileRef.put(file).then(() => {
      console.log('Image uploaded successfully');
      fileRef.getDownloadURL().then((url) => {
        publishPost(url);
      });
    }).catch((error) => {
      console.error('Error uploading image:', error);
    });
  }

  function publishPost(imageUrl) {
    const titleInput = document.querySelector('.new-post-title-input').value;
    const tagsInput = document.querySelector('.tags-input').value.split(',');
    const contentTextarea = document.querySelector('.post-content-textarea').value;
    const rateInput = document.querySelector('.rate').value;
    const authorName = "Rodrigo"; 
    const author_lower = authorName.toLowerCase();
    const idName = `${Date.now()}_${author_lower}`;

    const newPost = {
      titulo: titleInput,
      tags: tagsInput,
      contenido: contentTextarea,
      autor: authorName,
      autor_lower: author_lower,
      fecha: new Date().toISOString().split('T')[0],
      idName: idName,
      img: imageUrl,
      rate: parseInt(rateInput, 10), 
      cantidad_comentarios: 0,
      comentarios: []
    };

    db.collection('posts').doc(idName).set(newPost)
      .then(() => {
        console.log('Post published successfully!');
        window.location.href = '/home.html'; 
      })
      .catch((error) => {
        console.error('Error publishing the post:', error);
      });
  }
});
