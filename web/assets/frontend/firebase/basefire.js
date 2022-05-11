let verifyDownload = async (filename, ref, id, dlname) => {

  let isUser = false;

  await basefire.getUser().then(user => isUser = user);

  // if (isUser) {
  //   basefire.download(ref, filename, dlname);
  // } else {
    var popup = base(".popup-view");
    popup.popup('setConfig', 'src', '/module/popup:1922/json/file/' + id);
    popup.popup('setConfig', 'width', 600);
    popup.popup('open');
  //}

}

let authDownload = async (data) => {

  data = JSON.parse(data);

  var loggedIn = await basefire.auth(data.token);

  if (loggedIn) {

    basefire.setUser(data.email, data.name);
    basefire.download(data.fileref, data.filename, data.dlname);

  } else {

    console.log("LOGIN FAILED");

  }

}

let setUser = (email, name) => {

  localStorage.setItem("ue", email);
  localStorage.setItem("un", name);

}

let getUser = async () => {

  const { getAuth, onAuthStateChanged } = await import('/build/node_modules/firebase/auth');

  const auth = getAuth(basefire.firebaseApp);

  return new Promise((resolve, reject) => {

    onAuthStateChanged(auth, function(user) {
      resolve(user);
    });

  });

}

let auth = async function(token) {

  const { getAuth, signInWithCustomToken } = await import('/build/node_modules/firebase/auth');

  const auth = getAuth(basefire.firebaseApp);

  return signInWithCustomToken(auth, token)
  .then(function(){
    return true;
  })
  .catch(function(error) {
    //console.log(error.code);
    //console.log(error.message);
    return false;
  });

}

let getStorageUrl = async function(reference, token) {

  const { getStorage, ref, getDownloadURL } = await import('/build/node_modules/firebase/storage');

  var loggedIn = await basefire.auth(token);

  var storage = getStorage(basefire.firebaseApp);
  var gsReference = ref(storage, reference);

  let storageurl = await getDownloadURL(gsReference).then(function(url) {

    return url;

  }).catch(function(error) {

    console.log(error);
    return false;

  });

  console.log(storageurl);

}

let download = async function(reference, name, dlname) {

  const { getStorage, ref, getDownloadURL } = await import('/build/node_modules/firebase/storage');

  var storage = getStorage(basefire.firebaseApp);
  var gsReference = ref(storage, reference);

  let storageurl = await getDownloadURL(gsReference).then(function(url) {

    return url;

  }).catch(function(error) {

    console.log(error);
    return false;

  });

  if (storageurl) {
    base.event('Download', dlname, name);
    base.notification({
      'type': 'Download',
      'email':  localStorage.getItem("ue"),
      'name':   localStorage.getItem("un"),
      'download': dlname,
      'file': name,
      'url': base('[x-base-view-url]').attr('x-base-view-url')
    });

    window.location.href = storageurl;
  }

}

//dumb way to import stuff for use in another unlinked js file without imports
let getStorageFunctions = async function() {
  const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import('/build/node_modules/firebase/storage');

  basefire.storage = { getStorage, ref, uploadBytesResumable, getDownloadURL };
}

export {auth, download, verifyDownload, authDownload, setUser, getUser, getStorageUrl, getStorageFunctions};
