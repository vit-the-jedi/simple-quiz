const kbOutput = function (kbWeight) {
  const kbTotal = document.getElementById("kb-total");
  for (var i = 0; i <= kbWeight; i++) {
    (function (index) {
      setTimeout(function () {
        kbTotal.textContent = `${index}KB`;
      }, i * 80);
    })(i);
  }
};

setTimeout(function () {
  kbOutput(5);
}, 1000);

setTimeout(function () {
  showKBList();
}, 3000);

function showKBList() {
  const kbList = document.getElementById("kb-list");
  kbList.classList.add("fade-in");
}
