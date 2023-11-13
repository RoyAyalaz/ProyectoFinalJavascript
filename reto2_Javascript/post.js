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
function getQueryParam(param) {
  var searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

var postId = getQueryParam('idName');
function formatDate(timestamp) {
  const date = timestamp.toDate();

  const options = { year: 'numeric', month: 'short', day: 'numeric' };

  return date.toLocaleDateString('en-US', options);
}




function displayComment(comment) {
  const commentElement = document.createElement('div');
  commentElement.classList.add('comment');

  const avatarElement = document.createElement('img');
  avatarElement.classList.add('crayons-avatar__image');
  avatarElement.src = comment.avatarUrl || 'https://www.sports-king.com/images/nicknames/lionel-messi.jpg';
  avatarElement.alt = 'Avatar';
  commentElement.appendChild(avatarElement);

  const userDetailsElement = document.createElement('div');
  userDetailsElement.classList.add('comment-user-details');

  const userNameElement = document.createElement('span');
  userNameElement.classList.add('comment-user-name');
  userNameElement.textContent = comment.autorcomment || 'Anonymous'; 
  const commentDateElement = document.createElement('span');
  commentDateElement.classList.add('comment-date');

  commentDateElement.textContent = formatDate(comment.createdAt)  || 'Just now';

  userDetailsElement.appendChild(userNameElement);
  userDetailsElement.appendChild(commentDateElement);
  commentElement.appendChild(userDetailsElement);

  const commentTextElement = document.createElement('p');
  commentTextElement.classList.add('comment-text');
  commentTextElement.textContent = comment.text; 
  commentElement.appendChild(commentTextElement);

  const commentsContainer = document.querySelector('.existing-comments');
  if (commentsContainer.firstChild) {
    commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);
  } else {
    commentsContainer.appendChild(commentElement);
  }

}

function updateCommentsCountUI(postId) {
  const postRef = db.collection('posts').doc(postId);
  postRef.get().then(doc => {
    if (doc.exists) {
      const post = doc.data();
      const commentsCountElement = document.querySelector('cantidad_comentarios');
      const topComment = document.getElementById('top-comment')
      topComment.innerHTML=`<h2>Top comments (${post.cantidad_comentarios})`
     
    }
  });
}

function addComment(postId, commentText) {
  const comment = {
    text: commentText,
    createdAt: firebase.firestore.Timestamp.now(),
    autorcomment: "Rodrigo"
  };

  const postRef = db.collection('posts').doc(postId);

  db.runTransaction(transaction => {
    return transaction.get(postRef).then(postDoc => {
      if (!postDoc.exists) {
        throw "El documento no existe!";
      }

      const cantidadActualComentarios = postDoc.data().cantidad_comentarios || 0;

      transaction.update(postRef, {
        comentarios: firebase.firestore.FieldValue.arrayUnion(comment),
        cantidad_comentarios: cantidadActualComentarios + 1
      });
    });
  }).then(() => {
    console.log('Comentario agregado y cantidad actualizada');
    displayComment(comment);
    document.getElementById('comment-input').value = '';
    updateCommentsCountUI(postId);
  }).catch(error => {
    console.error('Error al agregar comentario:', error);
  });
}

const postsRef = db.collection('posts');


document.addEventListener('DOMContentLoaded', function() {
  var mainContent = document.querySelector('.main-content');
  var db = firebase.firestore();
  var postRef = db.collection('posts').doc(postId);
  var userEmail = localStorage.getItem('email');

    
  postRef.get().then((doc) => {
    if (doc.exists) {
      var post = doc.data();
      var postHTML = `
        <img class="waifu" src="${post.img}" alt="Post Image">
        <div class="post-info">
          <div class="author-info">
                    <img class="crayons-avatar__image" alt="User Profile" id="nav-profile-image" src="https://www.sports-king.com/images/nicknames/lionel-messi.jpg">
            <div class="author-details">
              <span class="author-name">${post.autor}</span>
              <br><span class="post-date">Posted on ${post.fecha}</span>
            </div>
            
          </div>
          <div class="flex-row emojis-comment">
          <div class="flex-row emojis-container">
            <img class="emojis" src="./img/reactionspost.png">
          </div>
          
        </div>
          <h1 class="post-title">${post.titulo}</h1>
          <div class="post-content">
            <p>${post.contenido}</p>
          </div>
          <div class="contenedor-reacciones">
        </div>
        
        </div>
      `;
      mainContent.innerHTML = postHTML;

      const comentarios = (post.comentarios || []).filter(comment => comment.createdAt && comment.createdAt.seconds);
      if(comentarios.length > 0) {
        comentarios.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        comentarios.forEach(comment => {
          displayComment(comment); 
        });
      }
    const topComment = document.getElementById('top-comment')
    topComment.innerHTML=`<h2>Top comments (${post.cantidad_comentarios})`

    } else {
      mainContent.innerHTML = '<p>Post not found.</p>';
    }
  }).catch((error) => {
    console.error("Error getting document:", error);
  });

  const submitCommentButton = document.getElementById('submit-comment'); 
  submitCommentButton.addEventListener('click', function() {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    
    if (commentText) {
      addComment(postId, commentText);
    } else {
      console.log('El comentario no puede estar vacío');
    }
  });
});
