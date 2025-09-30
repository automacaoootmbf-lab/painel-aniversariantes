const admin = require('firebase-admin');

async function main(){
  const saJson = process.env.SERVICE_ACCOUNT_JSON;
  const adminUsersJson = process.env.ADMIN_USERS_JSON;
  const projectId = process.env.FIREBASE_PROJECT || '';

  if(!saJson || !adminUsersJson) {
    console.error('Falta SERVICE_ACCOUNT_JSON ou ADMIN_USERS_JSON');
    process.exit(1);
  }

  const sa = JSON.parse(saJson);
  const adminUsers = JSON.parse(adminUsersJson);

  admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId
  });

  for(const u of adminUsers){
    try {
      // cria usuário ou recupera se já existir
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(u.email);
        console.log('Usuário já existe:', u.email);
      } catch(e) {
        userRecord = await admin.auth().createUser({
          email: u.email,
          emailVerified: false,
          password: u.password,
          disabled: false,
        });
        console.log('Criado usuário:', u.email, ' uid=', userRecord.uid);
      }

      // set custom claim admin:true
      await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
      console.log('Custom claim set admin:true para', u.email);
    } catch(err) {
      console.error('Erro criando/atualizando user', u.email, err.message || err);
    }
  }
  console.log('Done.');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(2); });
