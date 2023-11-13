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

const postsRef = db.collection('posts');

async function getAndRenderPosts() {
  try {
    const snapshot = await postsRef.get();
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    snapshot.forEach((doc) => {
        const post = doc.data();
      
        const postElement = document.createElement('div');
        postElement.classList.add('card', 'borders');
        postElement.innerHTML = `
          <div class="contenedor-waifu">
            <img class="waifu" src="${post.img}">
          </div>
          <div class="post-container">
            <div class="info-user flex-row">
              <div class="ico-container">
                <img class="ico" src="https://www.sports-king.com/images/nicknames/lionel-messi.jpg">
              </div>
              <div class="titulo-fecha">
                <p>${post.autor}</p>
                <p>${post.fecha}</p>
              </div>
            </div>
            <div class="info-post-container">
              <div class="header-texo">
                <a href="/post.html?idName=${post.idName}"> <h1>${post.titulo}</h1> </a>

                <div class="hashtags flex-row">
                  ${post.tags.map(tag => `<h3><span style="color:correspondingColor">#</span>${tag}</h3>`).join('')}
                </div>
              </div>
              <div class="contenedor-reacciones">
                <div class="flex-row emojis-comment">
                  <div class="flex-row emojis-container">
                    <img class="emojis" src="./img/emojis.png">
                    <p>${post.rate} reactions</p>
                  </div>
                  <div class="flex-row comment-container">
                    <img class="comment" src="./img/Coment.png">
                    <p>${post.cantidad_comentarios} comments</p>
                  </div>
                </div>
                <div class="read flex-row">
                  <p>4 min read</p>
                  <img class="etiqueta" src="./img/etiqueta.png">
                </div>
              </div>
            </div>
          </div>
        `;
      
        postsContainer.appendChild(postElement);
      });
      
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}
const recentDiscussionsRefDiscuss = db.collection('posts')
  .where('tags', 'array-contains', 'discuss') 
  .orderBy('fecha', 'desc') 
  .limit(5); 
const recentDiscussionsRefWaterCooler = db.collection('posts')
  .where('tags', 'array-contains', 'watercooler') 
  .orderBy('fecha', 'desc') 
  .limit(5); 
  async function getAndRenderDiscussions() {
    try {
      const snapshot = await recentDiscussionsRefDiscuss.get();
      const discussionsContainer = document.querySelector('.aside__second.borders');
  
      discussionsContainer.innerHTML = '<div class="space" id=""><h3 class="aside__second--h3">#discuss</h3></div>';
  
      let count = 0; 
      snapshot.forEach((doc) => {
        if (count < 5) { 
          const post = doc.data();
          const discussionElement = document.createElement('div');
          discussionElement.classList.add('space');
          discussionElement.innerHTML = `
           <h1 class="post-title">${post.titulo}</h1> </a>
          
            <a href="/post.html?idName=${post.idName}" class="aside-a">${post.titulo}</a>
            <a href="#" class="aside__second--job">${post.cantidad_comentarios} comments</a>
          `;
  
          discussionsContainer.appendChild(discussionElement);
          count++; 
        }
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }
  
async function getAndRenderWaterCooler() {
  try {
    const snapshot = await recentDiscussionsRefWaterCooler.get();
    const discussionsContainer = document.querySelector('.aside__second.borders.wat');

    discussionsContainer.innerHTML = '<div class="space" id=""><h3 class="aside__second--h3">#watercooler</h3></div>';

    let count = 0; 
    snapshot.forEach((doc) => {
      if (count < 5) {
        const post = doc.data();
        const discussionElement = document.createElement('div');
        discussionElement.classList.add('space');
        discussionElement.innerHTML = `
          <a href="/post.html?idName=${post.idName}" class="aside-a">${post.titulo}</a>
          <a href="#" class="aside__second--job">${post.cantidad_comentarios} comments</a>
        `;

        discussionsContainer.appendChild(discussionElement);
        count++; 
      }
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

  async function getAndRenderPostsByDate() {
    try {
      const snapshot = await postsRef.orderBy('fecha', 'desc').get();
      const postsContainer = document.getElementById('posts-container');
      postsContainer.innerHTML = ''; 
      console.log("LATEST ON")
      for (const doc of snapshot.docs){
        const post = doc.data();
        const latestComment = await getLatestComment(post.idName);
        const commentHtml =  renderLatestComment(latestComment);
        const postElement = document.createElement('div');
        postElement.classList.add('card', 'borders');
        postElement.innerHTML = `
          <div class="contenedor-waifu">
            <img class="waifu" src="${post.img}">
          </div>
          <div class="post-container">
            <div class="info-user flex-row">
              <div class="ico-container">
                <img class="ico" src="https://www.sports-king.com/images/nicknames/lionel-messi.jpg">
              </div>
              <div class="titulo-fecha">
                <p>${post.autor}</p>
                <p>${post.fecha}</p>
              </div>
            </div>
            <div class="info-post-container">
              <div class="header-texo">
               <a href="/post.html?idName=${post.idName}"> <h1 class="post-title">${post.titulo}</h1> </a>
                <div class="hashtags flex-row">
                  ${post.tags.map(tag => `<h3><span style="color:correspondingColor">#</span>${tag}</h3>`).join('')}
                </div>
              </div>
              <div class="contenedor-reacciones">
                <div class="flex-row emojis-comment">
                  <div class="flex-row emojis-container">
                    <img class="emojis" src="./img/emojis.png">
                    <p>${post.rate} reactions</p>
                  </div>
                  <div class="flex-row comment-container">
                    <img class="comment" src="./img/Coment.png">
                    <p>${post.cantidad_comentarios} comments</p>
                  </div>
                </div>
                <div class="read flex-row">
                  <p>4 min read</p>
                  <img class="etiqueta" src="./img/etiqueta.png">
                </div>
              </div>

              ${commentHtml}

            </div>
          </div>
        `;
      
        postsContainer.appendChild(postElement);
      };
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }

  async function getLatestComment(postId) {
    let latestComment = null;
    const commentsRef = db.collection('posts').where('idName', '==', postId).orderBy('fecha', 'desc').limit(1);
    const commentsSnapshot = await commentsRef.get();
    if (!commentsSnapshot.empty) {
      latestComment = commentsSnapshot.docs[0].data();
      console.log(latestComment.comentarios[0])
    }
    else {
      console.log("No encontrado"
      )
    }
    return latestComment.comentarios[0];
  }

  function timeSince(timestamp) {
    const commentDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const now = new Date();
    const diffInSeconds = (now.getTime() - commentDate.getTime()) / 1000;
  
    if (diffInSeconds < 60) { 
      return 'justo ahora';
    }
    const diffInMinutes = diffInSeconds / 60;
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} minutos atrás`;
    }
    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} horas atrás`;
    }
    const diffInDays = diffInHours / 24;
    if (diffInDays < 2) {
      return 'ayer';
    }
    
    return `hace ${Math.floor(diffInDays)} días`;
  }
  function formatDate(timestamp) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  
  function renderLatestComment(comment) {
    if (comment) {
      console.log("COMENTARIO : ", comment)
      return `
      <div class="comment-avatar">
          <img class="crayons-avatar__image" alt="User Profile" id="nav-profile-image" src="https://www.sports-king.com/images/nicknames/lionel-messi.jpg">
          </div>
        <div class="comment_text">
          
          <div class="comment-user-details">
            <span class="comment-user-name">${comment.autorcomment}</span>
            <span class="comment-date">${timeSince(comment.createdAt)}   </span>      
          </div>
          <div class="comment-text">${comment.text}</div>

        </div>
      `;
    } else {
      return '<div class="comment">No comments yet.</div>';
    }
  }
  async function getAndRenderPostsByComments() {
    try {
      const snapshot = await postsRef.orderBy('cantidad_comentarios', 'desc').get();
      const postsContainer = document.getElementById('posts-container');
      const relevantElement = document.getElementById('relevant');
      relevantElement.style.fontWeight = '700';
      relevantElement.style.color = 'black';
      postsContainer.innerHTML = ''; 
      console.log()
      for (const doc of snapshot.docs)  {
        const post = doc.data();
        const latestComment = await getLatestComment(post.idName);
        const commentHtml =  renderLatestComment(latestComment);
        const postElement = document.createElement('div');
        postElement.classList.add('card', 'borders');
        postElement.innerHTML = `
          <div class="contenedor-waifu">
            <img class="waifu" src="${post.img}">
          </div>
          <div class="post-container">
            <div class="info-user flex-row">
              <div class="ico-container">
                <img class="ico" src="https://www.sports-king.com/images/nicknames/lionel-messi.jpg">
              </div>
              <div class="titulo-fecha">
                <p>${post.autor}</p>
                <p>${post.fecha}</p>
              </div>
            </div>
            <div class="info-post-container">
              <div class="header-texo">
                <a href="/post.html?idName=${post.idName}"> <h1>${post.titulo}</h1> </a>

                <div class="hashtags flex-row">
                  ${post.tags.map(tag => `<h3><span style="color:correspondingColor">#</span>${tag}</h3>`).join('')}
                </div>
              </div>
              <div class="contenedor-reacciones">
                <div class="flex-row emojis-comment">
                  <div class="flex-row emojis-container">
                    <img class="emojis" src="./img/emojis.png">
                    <p>${post.rate} reactions</p>
                  </div>
                  <div class="flex-row comment-container">
                    <img class="comment" src="./img/Coment.png">
                    <p>${post.cantidad_comentarios} comments</p>
                  </div>
                </div>
                <div class="read flex-row">
                  <p>4 min read</p>
                  <img class="etiqueta" src="./img/etiqueta.png">
                </div>
              </div>
              ${commentHtml}
              
            </div>
          </div>
        `;
      
        postsContainer.appendChild(postElement);
      };
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }
  
  async function getAndRenderPostsByRate() {
    try {
      const snapshot = await postsRef.orderBy('rate', 'desc').get();
      const postsContainer = document.getElementById('posts-container');
      postsContainer.innerHTML = ''; 
  
      for (const doc of snapshot.docs)   {
        const post = doc.data();
        const latestComment = await getLatestComment(post.idName);
        const commentHtml =  renderLatestComment(latestComment);
        const postElement = document.createElement('div');
        postElement.classList.add('card', 'borders');
        postElement.innerHTML = `
          <div class="contenedor-waifu">
            <img class="waifu" src="${post.img}">
          </div>
          <div class="post-container">
            <div class="info-user flex-row">
              <div class="ico-container">
                <img class="ico" src="https://www.sports-king.com/images/nicknames/lionel-messi.jpg">
              </div>
              <div class="titulo-fecha">
                <p>${post.autor}</p>
                <p>${post.fecha}</p>
              </div>
            </div>
            <div class="info-post-container">
              <div class="header-texo">
                <a href="/post.html?idName=${post.idName}"> <h1>${post.titulo}</h1> </a>

                <div class="hashtags flex-row">
                  ${post.tags.map(tag => `<h3><span style="color:correspondingColor">#</span>${tag}</h3>`).join('')}
                </div>
              </div>
              <div class="contenedor-reacciones">
                <div class="flex-row emojis-comment">
                  <div class="flex-row emojis-container">
                    <img class="emojis" src="./img/emojis.png">
                    <p>${post.rate} reactions</p>
                  </div>
                  <div class="flex-row comment-container">
                    <img class="comment" src="./img/Coment.png">
                    <p>${post.cantidad_comentarios} comments</p>
                  </div>
                </div>
                <div class="read flex-row">
                  <p>4 min read</p>
                  <img class="etiqueta" src="./img/etiqueta.png">
                </div>
              </div>

              ${commentHtml}

            </div>
          </div>
        `;
      
        postsContainer.appendChild(postElement);
      };
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }
  function searchPostsByAuthor(authorName) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; 
  
    db.collection('posts')
      .where('autor_lower', '==', authorName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          const postElement = document.createElement('div');
          postElement.classList.add('card', 'borders');

          postElement.innerHTML = `
          <div class="contenedor-waifu">
            <img class="waifu" src="${post.img}">
          </div>
          <div class="post-container">
            <div class="info-user flex-row">
              <div class="ico-container">
                <img class="ico" src="https://www.sports-king.com/images/nicknames/lionel-messi.jpg">
              </div>
              <div class="titulo-fecha">
                <p>${post.autor}</p>
                <p>${post.fecha}</p>
              </div>
            </div>
            <div class="info-post-container">
              <div class="header-texo">
                <a href="/post.html?idName=${post.idName}"> <h1>${post.titulo}</h1> </a>

                <div class="hashtags flex-row">
                  ${post.tags.map(tag => `<h3><span style="color:correspondingColor">#</span>${tag}</h3>`).join('')}
                </div>
              </div>
              <div class="contenedor-reacciones">
                <div class="flex-row emojis-comment">
                  <div class="flex-row emojis-container">
                    <img class="emojis" src="./img/emojis.png">
                    <p>${post.rate} reactions</p>
                  </div>
                  <div class="flex-row comment-container">
                    <img class="comment" src="./img/Coment.png">
                    <p>${post.cantidad_comentarios} comments</p>
                  </div>
                </div>
                <div class="read flex-row">
                  <p>4 min read</p>
                  <img class="etiqueta" src="./img/etiqueta.png">
                </div>
              </div>
            </div>
          </div>
        `;
      
        postsContainer.appendChild(postElement);
        });
      })
      .catch((error) => {
        console.error("Error searching posts by author: ", error);
      });
  }
  document.addEventListener('DOMContentLoaded', (event) => {
    getAndRenderPostsByComments();
    getAndRenderDiscussions();
    getAndRenderWaterCooler();
    const relevantElement = document.getElementById('relevant');
    const latestElement = document.getElementById('latest');
    const topElement = document.getElementById('top');


    latestElement.addEventListener('click', function() {
      getAndRenderPostsByDate();
      this.style.fontWeight = '700';
      this.style.color = 'black';
      relevantElement.style.removeProperty('fontWeight')
      relevantElement.style.removeProperty('color')
      topElement.style.removeProperty('fontWeight')
      topElement.style.removeProperty('color')      
    });
    relevantElement.addEventListener('click', function() {
        getAndRenderPostsByComments();
        this.style.fontWeight = '700';
        this.style.color = 'black';
        latestElement.style.removeProperty('fontWeight')
        latestElement.style.removeProperty('color')
        topElement.style.removeProperty('fontWeight')
        topElement.style.removeProperty('color')  
      });


      topElement.addEventListener('click', function() {
        getAndRenderPostsByRate();
        this.style.fontWeight = '700';
        this.style.color = 'black';
        relevantElement.style.removeProperty('fontWeight')
        relevantElement.style.removeProperty('color')
        latestElement.style.removeProperty('fontWeight')
        latestElement.style.removeProperty('color')    
      });

      document.getElementById('search-input').addEventListener('input', (event) => {
        const authorName = event.target.value.trim().toLowerCase();  
      
        if (authorName.length > 0) {
          searchPostsByAuthor(authorName);
        } else {
          getAndRenderPostsByComments();
        }
      });
  });
  