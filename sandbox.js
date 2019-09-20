const list = document.querySelector("ul");
const form = document.querySelector("form");
const buttonUnsubscribe = document.querySelector("#unsubscribe");
const addTodo = (todo, id) => {
  let time = todo.created_at.toDate();
  let html = `

    <li class="" data-id="${id}">
    <div>${todo.title}</div>
    <div>${time}</div>
    <button class="btn btn-primary btn-sm my-2">Delete</button>
    </li>

    `;
  list.innerHTML += html;
};
//WE GOT RID OF THIS, BECOUSE WE DEPLOY REAL TIME LISTENER APPROACH UNDERNEATH.
//get todos from firestore:
// db.collection("todos")
//   .get()
//   .then(snapshot => {
//     //this is the time when we ve got data:
//     //snapshot it is an image how our collection looks at that minute.
//     // console.log("data fetched", snapshot.docs[0].data());
//     //reference snapshot.docs is an array and we can cycle through and use for each item built in method call data() to get the data:
//     snapshot.docs.forEach(doc => {
//       // console.log(doc.id);
//       addTodo(doc.data(), doc.id);
//     });
//   })
//   .catch(err => {
//     console.log(err);
//   });

//get real time data listener (listen for every data change):
//firstly we re creating func expression to delete todos:
const deleteTodo = id => {
  //we already deleting todos from firebase at event listener. Here we only need to delete todo from template.
  const todos = document.querySelectorAll("li");
  todos.forEach(todo => {
    if (todo.getAttribute("data-id") === id) {
      todo.remove();
    }
  });
};

const unsub = db.collection("todos").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    //get todos and show on website:
    if (change.type === "added") {
      addTodo(doc.data(), doc.id);
      form.reset(); //here we clear the input after sending todo to firebase and to DOM.
      //here we remove chosen todo from DOM, after todo was deleted from firebase:
    } else if (change.type === "removed") {
      deleteTodo(doc.id);
    }
  });
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
//deleting each todo
//we use event delegation so we do event on first common (wspólny) parent which is list in this case:
list.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.parentElement.getAttribute("data-id");
    // console.log(e.target.parentElement.getAttribute("data-id"));
    //we got id from database by custom data-id written in html template. we  use it to get reference  to chosen one document by using method: doc() and as argument we pass and id, which we ve got.
    db.collection("todos")
      .doc(id)
      .delete();
  }
});
//unsubscribe  listening from data changes in the collection:
buttonUnsubscribe.addEventListener("click", () => {
  unsub();
});
