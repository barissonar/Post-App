let postsArray;


getPosts = () => {                         // API isteği yapılan fonksiyon.
     
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => {
        postsArray = data;
        addDOM();
        console.log(data);
         
    })
    .catch(error => console.error('POSTS Hatası:', error));
 
}

getComments = async (id) => {                   // belirli bir post ID'ye göre Commentlerin getirildiği fonksiyon 
    
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
    const data = await response.json();
    return data;
}


getPosts();


addDOM = () => {                                 // API isteğinden gelen dataları DOM'a ekleyen fonksiyon.

        postsArray.forEach( async (item) => {

        const comment = await getComments(item.id);
        const divElement = document.createElement('div');
        divElement.className = 'post-item';
        divElement.id = `post-item-${item.id}`;
        divElement.innerHTML = `
             <div class="post-delete-button">
                <svg class="post-delete" delete-id="${item.id}" onclick="deletePost(this)" xmlns="http://www.w3.org/2000/svg" height="23" width="23" fill="#24385c" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
                </svg>
             </div>
             <hr/>
             <div class="post-title-body">
                <h3 class="post-title">${item.title}</h3>
                <p class="post-body">${item.body}</p>
             </div>    
             <hr/>
             <div class="post-footer">
                <span class="post-comment-button" get-comment-id="${item.id}" onclick = "commentCreateModal(this)">${comment.length} Comment</span>   
               
             </div>
        `;
        const postContainerDOM = document.querySelector(".post-container");
        postContainerDOM.appendChild(divElement);
            
        });
   
       
}

deletePost = (element) => {                
       
      
       const deleteId = element.getAttribute("delete-id");
       console.log("id",deleteId);
       const indeks = postsArray.findIndex((item) =>  (String(item.id) === deleteId));
       console.log("index",indeks);
       if (indeks !== -1) {
        postsArray.splice(indeks,1)
        console.log(postsArray);
      } else {
        console.log("Id bulunamadı.");
      }
       
       const postContainerDOM = document.querySelector(".post-container");
       const postItemDOM = document.querySelector(`#post-item-${deleteId}`);
       postContainerDOM.removeChild(postItemDOM);

      
      
}

commentCreateModal = async (element) => {       // Post yorumlarının oluşturulduğu fonksiyon.

    const parentElement = element.parentNode;
    const mainCommentsDOM = parentElement.querySelector(".main-comments");    
   
    if(mainCommentsDOM && mainCommentsDOM.children.length > 0) {
        parentElement.removeChild(mainCommentsDOM);
    }
    else {
        console.log("oluşturuldu");
        const divElement = document.createElement("div");
        divElement.className = 'main-comments';
        parentElement.appendChild(divElement);
        const postId = element.getAttribute("get-comment-id");
        const comment = await getComments(postId);
        comment.forEach((item) => {
    
            const divElement = document.createElement("div");
            divElement.className = 'comments-container';
            divElement.innerHTML = `<div class="comments-item">
                                      <h4 class="comments-name">
                                       ${item.name}
                                      </h4>
                                      <a href="mailto:${item.email}" class="comments-email">
                                      <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
                                      </svg>
                                       ${item.email}
                                      </a>
                                      <p class="comments-body">
                                       ${item.body}
                                      </p>
                                    </div>   `;
            const mainCommentsNEW = parentElement.querySelector(".main-comments");                     
            mainCommentsNEW.appendChild(divElement);
                   
            }); 
    }

}

updateDOM = (filteredPosts) => {                                  // Filtrelenmiş postların DOM'a eklendiği fonksiyon.
    const postContainerDOM = document.querySelector(".post-container");
    postContainerDOM.innerHTML = ""; 
    if(filteredPosts.length === 0){
        postContainerDOM.innerHTML = "<div class='error'> No posts matching this filter were found.</div>";
    }
    filteredPosts.forEach(async (item) => {
        const comment = await getComments(item.id);
        const divElement = document.createElement('div');
        divElement.className = 'post-item';
        divElement.id = `post-item-${item.id}`;
        divElement.innerHTML = `
             <div class="post-delete-button">
                <svg class="post-delete" delete-id="${item.id}" onclick="deletePost(this)" xmlns="http://www.w3.org/2000/svg" height="23" width="23" fill="#24385c" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
                </svg>
             </div>
             <hr/>
             <div class="post-title-body">
                <h3 class="post-title">${item.title}</h3>
                <p class="post-body">${item.body}</p>
             </div>    
             <hr/>
             <div class="post-footer">
                <span class="post-comment-button" get-comment-id="${item.id}" onclick = "commentCreateModal(this)">${comment.length} Comment</span>   
               
             </div>
        `;
        postContainerDOM.appendChild(divElement);
      });

}

filterPosts = (element) => {     // Postların filtrelendiği fonksiyon.
       
        const filterValue = element.value.toLowerCase();
        const filteredPosts = postsArray.filter((post) => {
            return post.title.toLowerCase().includes(filterValue) || post.body.toLowerCase().includes(filterValue);
        });
        
        updateDOM(filteredPosts);

}






