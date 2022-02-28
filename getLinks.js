export default function (str) {
  let reg =
    /(?:(?:(?:[a-z]+:)?\/\/)|www\.)(?:\S+(?::\S*)?@)?(?:localhost|(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#][^\s\n\)'`"\&\\]*)?/gi;

  return (str.match(reg) || []).map(function (it) {
    "//" === it.substr(0, 2) && (it = "http:" + it);
    "http" !== it.substr(0, 4) && (it = "http://" + it);
    "'" === it.substr(-1) && (it = it.substr(0, it.length - 1));

    return it;
  });
}
