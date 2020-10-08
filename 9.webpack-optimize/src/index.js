let button = document.createElement('button');
button.innerHTML="动态创建按钮";
button.addEventListener('click',()=>{
    import(
      /* webpackPreload: true */
      /* webpackChunkName: "title" */
      "./title.js"
    ).then((result) => {
      console.log(result.default);
    });
});

document.body.appendChild(button);

