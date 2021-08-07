class PostTemplate extends HTMLElement {
   constructor() {
      super();      
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
   }
}

window.customElements.define('post-template', PostTemplate);

const template = document.createElement('template');
const postsContainer = document.querySelector('.posts-container');
const popupContainer = document.querySelector('.popup-bg');
const popupCloseBtn = document.querySelectorAll('.popup-btn-close');
const [ postEditor, deleteWarning ] = popupContainer.children;
const [ editAuthor, editTitle, editCaption, popupEditBtn ] = document.querySelector('.edit-form');
const [ author, title, caption, postSubmitBtn ] = document.querySelector('.post-form');
const postEdit = new Event('editingpost');

if (localStorage.getItem('posts')) {
   JSON.parse(localStorage.getItem('posts')).forEach((getPost) => {
      addPost(getPost);
  })
}

postSubmitBtn.addEventListener('click', (e) => {

   e.preventDefault();

   if (!author.value) return alert('Enter your name first!');
   if (!title.value) return alert('Please enter a title for your post.');
   if (!caption.value) return alert('Post caption cannot be empty!');
   
   const newPost = {
      lsAuthor: author.value,
      lsTime: getTime(),
      lsTitle: title.value,
      lsCaption: caption.value
   }

   addPost(newPost);
   
   let lsPost = localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts')) : [];

   lsPost.push(newPost);   
   localStorage.setItem('posts', JSON.stringify(lsPost));

   document.querySelector('.post-form').reset();

})

function addPost(post) {

   template.innerHTML = `

   <link rel="stylesheet" href="./css/templates.css">
   
   <div class="post-content">
      <h1 class="post-title">${post.lsTitle}</h1>
      <div class="post-details">
         <h3>&gt; ${post.lsAuthor} — ${post.lsTime}</h3>
      </div>
      <hr>
      <p class="post-caption">${post.lsCaption}</p>
      <hr>
      <div class="post-controls">
         <button class="post-btn-edit">EDIT</button>
         <button class="post-btn-delete">DELETE</button>
      </div>
   </div>
   
   `;

   let newPost = document.createElement('post-template');
   postsContainer.appendChild(newPost);

   const thisPost = document.querySelectorAll('post-template');
   const postIndex = thisPost.length - 1;
   const root = thisPost[postIndex] && thisPost[postIndex].shadowRoot;
   const postDeleteBtn = root.querySelector('.post-btn-delete');
   const postEditBtn = root.querySelector('.post-btn-edit');

   postDeleteBtn.addEventListener('click', () => {

      thisPost[postIndex].classList.toggle('deleting-post');
      thisPost[postIndex].style.animation = 'deleted 0.7s ease-out';

      deletePost();

      thisPost[postIndex].addEventListener('animationend', () => {
         thisPost[postIndex].remove();         
      });

   })

   postEditBtn.addEventListener('click', () => {

      thisPost[postIndex].classList.toggle('post-on-edit');
      popupContainer.classList.toggle('popup-active');
      postEditor.classList.toggle('popup-active');
      popupContainer.dispatchEvent(postEdit);

   })

}

popupContainer.addEventListener('editingpost', () => {
   
   const post = document.querySelector('.post-on-edit');
   const root = post && post.shadowRoot;
   const postAuthor = root.querySelector('.post-details').children[0].innerHTML.match(/(?<=^&gt;\s).*(?=\s—\s.*$)/g);
   const postTitle = root.querySelector('.post-title').innerHTML;
   const postCaption = root.querySelector('.post-caption').innerHTML;

   editAuthor.setAttribute('value', postAuthor);
   editTitle.setAttribute('value', postTitle);
   editCaption.innerHTML = postCaption;

})

popupEditBtn.addEventListener('click', (e) => {
      
   e.preventDefault();
   
   const post = document.querySelector('.post-on-edit');
   const root = post && post.shadowRoot;
   let time = getTime();

   root.querySelector('.post-details').children[0].innerHTML = `&gt; ${editAuthor.value} — ${time} EDITED`;
   root.querySelector('.post-title').innerHTML = editTitle.value;
   root.querySelector('.post-caption').innerHTML = editCaption.value;

   let edited = {
      lsAuthor: editAuthor.value,
      lsTime: `${time} EDITED`,
      lsTitle: editTitle.value,
      lsCaption: editCaption.value
   }

   let lsIndex = Array.prototype.indexOf.call(postsContainer.children, post);
   let editedPost = JSON.parse(localStorage.getItem('posts'));
   editedPost[lsIndex] = edited;

   localStorage.setItem('posts', JSON.stringify(editedPost));

   document.querySelector('.edit-form').reset();

   popupContainer.classList.toggle('popup-active');
   postEditor.classList.toggle('popup-active');
   post.classList.toggle('post-on-edit');

})

popupCloseBtn.forEach((close) => {

   close.addEventListener('click', (e) => {
   
      const post = document.querySelector('.post-on-edit');
      popupContainer.classList.toggle('popup-active');
      e.target.parentElement.classList.toggle('popup-active');
      post.classList.toggle('post-on-edit');
      
   })

})

function getTime() {

   let now = new Date();
   let month = now.getMonth();
   let date = now.getDate();
   let year = now.getFullYear();
   let hr = now.getHours() % 12;
   let mins = now.getMinutes().toString().padStart(2, '0');
   let ampm = now.getHours() > 12 ? 'PM' : 'AM';
   return `${month}/${date}/${year} (${hr}:${mins} ${ampm})`;
   
}

function deletePost() {

   const allPosts = document.querySelectorAll('post-template');
   for (let i = 0; i < allPosts.length; i++) {

      if (allPosts[i].classList.contains('deleting-post')) {

         let lsPost = JSON.parse(localStorage.getItem('posts')).filter( (val, ind) => ind !== i );
         localStorage.setItem('posts', JSON.stringify(lsPost));
         break;
         
      }
   }

}