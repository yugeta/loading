Loading
==
```
Author : Yugeta.Koji
Date   : 2020.08.15
```

# Summary
データをLoadしている間のアニメーション表示


# Setting
  -  head-area
  <script src="../src/loading.js"></script>

  - body-area : 画面全体
  var loading = new $$loading();

  - body-area : 部分要素
  var loading = new $$loading({
    parent : document.querySelector(".content-1")
  });


