import type { Stemm } from "../types";

const enSuffixes =
  "abl,acabl,icabl,idabl,eabl,iceabl,uishabl,umabl,inabl,ionabl,erabl,orabl,urabl,atabl,itabl,entabl,izabl,ionabl,ulabl,ibl,igibl,ac,ic,ific,entific,onic,ipic,eric,atic,etic,antic,entic,iotic,estic,istic,anc,ificanc,aganc,ianc,urianc,ilanc,ulanc,enanc,eranc,isanc,ivanc,enc,ificenc,igenc,inenc,id,ud,itud,icitud,if,ag,iag,ledg,log,ish,al,ical,ifical,logical,ial,icial,ificial,onical,atical,etical,estical,onial,orial,antial,ential,idential,nal,inal,ional,ational,itional,utional,ipal,eral,oral,ural,ital,ental,mental,amental,imental,ual,ectual,itual,ival,ul,ful,eful,iful,some,esome,elsome,ism,icism,aticism,ialism,ualism,etism,iotism,um,ium,imum,ican,ian,ician,inian,arian,man,eman,erman,men,emen,ermen,inessmen,aign,in,ain,inin,antin,on,ion,alion,ilion,sion,asion,ision,ulsion,ension,ersion,ation,ication,ification,idation,igation,iation,ilation,ulation,ipulation,ination,eration,oration,isation,itation,entation,estation,uation,ivation,ization,ition,estion,ution,inution,ison,eton,iton,ern,ar,iar,iliar,ilar,ular,abular,acular,icular,enar,inar,ionar,orar,etar,itar,entar,mentar,utar,er,icer,ager,enger,isher,ier,alier,elier,eler,somer,ener,iner,ioner,itioner,utioner,erner,erer,urer,eter,anter,enter,ester,ister,izer,or,ator,igator,iator,ulator,etor,itor,icitor,mentor,utor,ivor,ur,our,asur,atur,icatur,iatur,itur,is,eris,less,eless,ureless,ingless,ionless,ness,edness,idness,iveness,itiveness,ingness,ishness,iness,eliness,alness,fulness,enness,erness,lessness,usness,ousness,iousness,estness,us,inus,ous,ious,acious,idious,ilious,onious,arious,erious,urious,etious,itious,entious,alous,ulous,inous,ainous,erous,orous,urous,itous,entous,at,icat,ificat,isticat,idat,igat,iat,ilat,ulat,iculat,ipulat,inat,ionat,unat,erat,orat,itat,ilitat,entat,ivat,ect,itect,et,iet,elet,ulet,enet,inet,it,acit,icit,idit,alit,ialit,inalit,ionalit,imentalit,ualit,ilit,abilit,ibilit,ulit,ianit,init,unit,arit,iarit,ilarit,ularit,erit,orit,ivit,ant,icant,ificant,agant,ilant,itant,ent,ificent,igent,ient,icient,ulent,inent,ment,ament,erament,ement,agement,urement,isement,ledgment,ishment,iment,iliment,onment,ionment,ipment,erment,iot,ert,ist,alist,ialist,italist,entist,est,iest,ett,ut,iq,iv,asiv,ativ,icativ,iativ,ulativ,inativ,itiv,utiv,inutiv,iz,iciz,ializ,iniz,eriz,oriz,";
const reWording = new RegExp(
  `^([a-z]{2,12}?[bcdfghklmnprstvxvwz])` +
  `(${enSuffixes.split(",").join("|")})?` +
  `(s|es|ers|er|ed|(i|l|en)ed|en|e|y|ing|ings|(i|u|l)es|ry)?$`
);

export const stemm = function (s: string, ALL = {}): Stemm {
  s = `${s}`;
  const l = s.length;
  if (l < 4) {
    return { id: s, name: s, names: { [s]: 1 } };
  }
  const ly = s.endsWith("ly") ? 'ly' : undefined
  if (ly) {
    s = s.slice(0, -2);
  }

  const [, s1] = s.match(reWording) || [0, s]
  const l1 = s1.length;
  const id = s1[l1 - 1] === s1[l1 - 2] ? s1.slice(0, -1) : s1;

  const r = id in ALL ? ALL[id] : (ALL[id] = {
    id,
    name: s,
    names: {},
  });

  r.names[s] = 1;

  return r;
};

const cache = new Map();

export const getStemmByToken = (s: string, ALL = {}) => cache.has(s) ? cache.get(s) : cache.set(s, stemm(s, ALL)).get(s);
