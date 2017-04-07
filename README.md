Guía de Quito
======
Aplicación cliente de [Guía de Quito](https://github.com/xavierxc14/GuiaTesis)

Sistema operativo de desarrollo: Distribuciones de Linux basadas en Debian y Ubuntu

## Dependencias
- [Nodejs versión LTS](https://nodejs.org/es/download/package-manager/)
- [Bower v1.3.3](https://bower.io/#install-bower): `$ sudo npm install -g bower`
- [Apache Cordova](https://cordova.apache.org/#getstarted): `$ sudo npm install -g cordova`
- [Ionic v1.7.x](http://ionicframework.com/docs/v1/overview/#starter): `$ sudo npm install -g ionic`
- [Android SDK](https://developer.android.com/studio/index.html?hl=es-419#tos-header): [API 22.x](https://developer.android.com/studio/releases/sdk-tools.html?hl=es-419)

## Configuración
- Ejecutar `$ npm install` para instalar las dependencias de node (core).
- Ejecutar `$ bower install` para instalar las dependencias del bower (interfaz).
- Ejecutar `$ ionic state reset` para instalar los plugins de Ionic.
- Ejecutar `$ ionic hooks add` para instalar los hooks de las plataformas de Ionic.
- **Una vez instalado el plugin de Wikitude** copiar en la línea 12 del archivo _/plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js_ la clave del producto.
- Se debe crear una app en facebook, agregar la plataforma deseada y crear un hash key con el comando:

        keytool -exportcert -alias androiddebugkey keystore $HOME/.android/debug.keystore | openssl sha1 -binary | openssl base64
- Agregar la plataforma Android: `$ ionic platform add android`
- Compilar el apk para Android: `$ ionic build android`
- Ver dispositivos Android conectados: `$ adb devices`
- Ejecutar la aplicación en un dispositivo conectado y que se muestre en la lista de dispositivos: `$ ionic run <id_dispositivo>`