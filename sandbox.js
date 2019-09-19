const list = document.querySelector("ul");
const addTodo = todo => {
  let html = `

    <li class="">
    <div>${todo.title}</div>

    </li>

    `;
  list.innerHTML += html;
};

//get todos from firestore:
db.collection("todos")
  .get()
  .then(snapshot => {
    //this is the time when we ve got data:
    //snapshot it is an image how our collection looks at that minute.
    // console.log("data fetched", snapshot.docs[0].data());
    //reference snapshot.docs is an array and we can cycle through and use for each item built in method call data() to get the data:
    snapshot.docs.forEach(doc => {
      //   console.log(doc.data());
      addTodo(doc.data());
    });
  })
  .catch(err => {
    console.log(err);
  });
