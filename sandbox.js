const list = document.querySelector("ul");
const form = document.querySelector("form");
const addTodo = todo => {
  let time = todo.created_at.toDate();
  let html = `

    <li class="">
    <div>${todo.title}</div>
    <div>${time}</div>
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

//SAVING TODOS
//firstly create submit event on form to send todos:

form.addEventListener("submit", e => {
  e.preventDefault();

  const now = new Date();
  const todo = {
    //we do this becouse of id saved at html in form tag
    title: form.todos.value,
    //we get access to firebase, then to firestore library (we can do this becouse of CDN's we included, and automaticly we use these variables!). it cvreates for us timestamp-firebase object which we want to store in firebase - from our date javascript object.
    created_at: firebase.firestore.Timestamp.fromDate(now)
  };
  //at now we re adding new todo to our collection (it will be the firebase document). it is async method:
  db.collection("todos")
    .add(todo)
    .then(() => {
      console.log(todo);
    })
    .catch(err => {
      console.log(err);
    });
});
