let albums = document.querySelectorAll(".albums a");

for (let i = 0; i < albums.length; i++) {
  if (i == 0) {
    albums[i].style.zIndex = albums.length;
  } else {
    albums[i].style.zIndex = albums.length - i;
  }
}
