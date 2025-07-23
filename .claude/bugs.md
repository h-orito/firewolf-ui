- トップページ開催中の村の村カードについて

  - 開始予定が Invalid Date になっている
  - 構成が「不明」になっている

- コンソールエラー

```
GET http://localhost:3000/manifest.json 404 (Not Found)
```

```
icons/icon-144x144.png:1  GET http://localhost:3000/icons/icon-144x144.png 404 (Not Found)このエラーを分析
firewolf:1 Error while trying to use the following icon from the Manifest: http://localhost:3000/icons/icon-144x144.png (Download error or resource isn't a valid image)
```
