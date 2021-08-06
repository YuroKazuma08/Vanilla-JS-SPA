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
const [ author, title, caption, postBtn ] = document.querySelector('.post-form')

postBtn.addEventListener('click', (e) => {

   e.preventDefault();

   if (!author.value) return alert('Enter your name first!');
   if (!title.value) return alert('Please enter a title for your post.');
   if (!caption.value) return alert('Post caption cannot be empty!');

   const now = new Date();
   const month = now.getMonth();
   const date = now.getDate();
   const year = now.getFullYear();
   const hr = now.getHours() % 12;
   const mins = now.getMinutes().toString().padStart(2, '0');
   const ampm = now.getHours() > 12 ? 'PM' : 'AM';
   const time = `${month}/${date}/${year} (${hr}:${mins} ${ampm})`;

   template.innerHTML = `

   <link rel="stylesheet" href="./css/templates.css">
   
   <div class="post-content">
      <h1 class="post-title">${title.value}</h1>
      <div class="post-details">
         <h3>&gt; ${author.value} — ${time}</h3>
      </div>
      <hr>
      <p class="post-caption">${caption.value}</p>
      <hr>
      <div class="post-controls">
         <button class="post-btn-edit">EDIT</button>
         <button class="post-btn-delete">DELETE</button>
      </div>
   </div>
   
   `;

   let newPost = document.createElement('post-template');
   postsContainer.appendChild(newPost);

   document.querySelector('.post-form').reset();

})