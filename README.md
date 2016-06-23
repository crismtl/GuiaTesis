Guía de Quito
======
App cliente de Guía de Quito

## Dependencias
- NodeJS
- Apache Cordova: `$ sudo npm install -g cordova`
- Ionic: `$ sudo npm install -g ionic`
- Android SDK

## Configuración
- Ejecutar `npm install` para instalar las dependencias del node (core).
- Ejecutar `bower install` para instalar las dependencias del bower (interfaz).
- Ejecutar `ionic state reset` para instalar los plugins de Ionic.
- Ejecutar `ionic hooks add` para instalar los hooks de las plataformas de Ionic.
- **Una vez instalado el plugin de Wikitude** copiar en la línea 12 del archivo la clave del producto.
- Se debe crear una app en facebook, agregar la plataforma deseada y crear un hash key con el comando:

        keytool -exportcert -alias androiddebugkey keystore $HOME/.android/debug.keystore | openssl sha1 -binary | openssl base64
