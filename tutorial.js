'use strict';
// The guide follows ordinary controls; it never intercepts their clicks.
const tutorial={index:0,hidden:false,key:'',direction:'forward',lastScreen:'',scrolls:new Map(),focuses:new Map()};
const tabLessons={
 'Serviços':['Escolha o atendimento','Aqui aparecem os serviços oferecidos pelo profissional: consultas e outros atendimentos cadastrados. Cada card informa o nome, a duração e o preço. Toque no serviço desejado para ir direto à escolha de data e horário.'],
 'Onde atende':['Veja onde será atendido','Esta aba reúne clínicas vinculadas e outros locais informados pelo profissional. O paciente confere a localização; alguns locais externos exigem agendamento pelo próprio consultório.'],
 'Acompanhamento':['Acompanhe as sessões','Quando houver um acompanhamento contratado, esta aba reúne o progresso das sessões e a próxima consulta. O pacote mostrado nesta prévia é apenas um exemplo.'],
 'Avaliações':['Consulte as avaliações','O paciente pode consultar a nota e as avaliações do profissional para apoiar sua escolha. Nesta prévia, os indicadores são ilustrativos.'],
 'Sobre':['Conheça o profissional','Conheça a apresentação, formação e especialidades informadas pelo profissional. Essas informações ajudam o paciente a entender o atendimento oferecido.']
};
function tourKey(){return state.screen==='profile'?(state.clinic?'clinic':'profile'):state.screen;}
function tourStep(){return ['home','search','profile','calendar','payment','done'].indexOf(state.screen);}
function progressBar(){const labels=['Início','Busca','Perfil','Data e hora','Pagamento','Conclusão'],active=tourStep();return `<div class="tour-progress" aria-label="Etapas do tutorial"><div class="tour-segments">${labels.map((n,i)=>`<span class="${i<=active?'reached':''} ${i===active?'current':''}" ${i===active?'aria-current="step"':''}><i></i><small>${n}</small></span>`).join('')}</div><button type="button" data-action="review-tip">${tutorial.hidden?'Rever dica':'Dicas do tutorial'} ${icon('help')}</button></div>`;}
function tourLessons(){
 if(state.screen==='home')return [
  {target:'[data-action="open-search"]',anchor:'.home-header',title:'Comece pela busca',text:'Toque na lupa destacada para buscar uma clínica, especialidade ou profissional.'},
  {target:'.home-specialties [data-action="example"]',anchor:'.home-specialties',title:'Atalhos por especialidade',text:'O paciente também pode começar por uma especialidade. Toque em Clínico para experimentar o percurso desta demonstração.'},
  {target:'.home-picked [data-action="profile"]',anchor:'.home-picked',title:'Descubra opções de atendimento',text:'A página inicial reúne clínicas e profissionais para explorar. Toque no card destacado para conhecer o profissional.'},
  {target:'.home-nearby [data-action="profile"]',anchor:'.home-nearby',title:'Veja o que está por perto',text:'As listas de clínicas e profissionais próximos ajudam a explorar o atendimento na região selecionada. Toque no profissional destacado para abrir o perfil. A localização desta prévia é ilustrativa.'}
 ];
 if(state.screen==='search')return [
  {target:'#search-form',title:'O que o paciente procura?',text:'Digite uma especialidade, uma clínica ou o nome de um profissional. Para experimentar, busque Clínica Geral.',cta:'Preencher exemplo',action:'example'},
  {target:'.chips',title:'Refine os resultados',text:'Use os filtros para ver clínicas, profissionais ou especialidades. Perto de mim usa a localização escolhida; nesta demonstração ela é ilustrativa.'},
  {target:'.result[data-action="profile"]',fallback:'.result',title:'Abra o perfil',text:'Toque no card do profissional. O paciente encontra especialidade, clínica e informações para conhecer o atendimento.'}
 ];
 if(state.screen==='profile'&&state.clinic)return [{target:'.result[data-action="profile"]',title:'Da clínica ao profissional',text:'Dentro da clínica, o paciente escolhe com quem deseja se consultar. Toque no profissional destacado para continuar.'}];
 if(state.screen==='profile')return [
  ...Object.entries(tabLessons).map(([tab,[title,text]])=>({target:tab==='Serviços'?'.service':`.tabs [data-value="${tab}"]`,anchor:'.tabs',title,text,tab})),
  {target:'.service',title:'Toque no serviço desejado',text:'Consulta de Rotina é apenas um exemplo. O paciente pode selecionar qualquer serviço que o profissional disponibilizar, conferindo duração e preço. O próximo passo é escolher data e horário.',tab:'Serviços'}
 ];
 if(state.screen==='calendar')return [
  {target:'.day.available',anchor:'.calendar',fallback:'.month button[data-value="1"]',title:'Escolha uma data',text:'Os pontos verdes marcam dias com disponibilidade. Toque em um deles; as setas permitem consultar os próximos meses.'},
  {target:'.time',anchor:'.times-card',title:'Selecione um horário',text:'Depois de escolher o dia, toque em um horário disponível. O horário selecionado fica azul.'},
  {target:'[data-action="confirm"]',anchor:'.date-main',before:true,title:'Conheça o próximo passo',text:'Com data e horário escolhidos, toque em Confirmar para conhecer as opções de pagamento do aplicativo. Esta demonstração não agenda nem cobra nada.'}
 ];
 if(state.screen==='payment')return [{target:'[data-action="finish-demo"]',anchor:'.payment-main',before:true,title:'Dois caminhos de pagamento',text:'Pagar agora oferece cartão ou Pix no pagamento online. Pagar na clínica é o segundo caminho, com suas próprias condições. Aqui basta ler: não é necessário selecionar, aceitar condições ou pagar. Toque em Concluir demonstração quando terminar.'}];
 return [{target:'.summary',title:'Percurso concluído',text:'Você viu como o paciente sai da página inicial, encontra atendimento, conhece o profissional, escolhe serviço, data e horário e chega às opções de pagamento. Pode recomeçar para explorar novamente.'}];
}
function coachMarkup(lesson,total){return `<aside class="coach-card" aria-label="Dica do tutorial"><span class="coach-pin" aria-hidden="true"></span><div class="coach-top"><span>DICA ${tutorial.index+1} DE ${total}</span><button data-action="hide-tip" aria-label="Ocultar dica">×</button></div><h2>${lesson.title}</h2><p>${lesson.text}</p>${lesson.action?`<button class="coach-example" data-action="${lesson.action}">${lesson.cta}</button>`:''}<div class="coach-controls"><button data-action="tip-prev" ${tutorial.index===0?'disabled':''}>← Anterior</button><button data-action="${tutorial.index===total-1?'hide-tip':'tip-next'}">${tutorial.index===total-1?'Entendi ✓':'Próxima dica →'}</button></div></aside>`;}
function mountCoach(reveal=false){
 document.querySelectorAll('.coach-card').forEach(e=>e.remove());
 document.querySelectorAll('.tour-target').forEach(e=>{e.classList.remove('tour-target');e.removeAttribute('aria-describedby');});
 if(tutorial.hidden)return;
 const lessons=tourLessons();tutorial.index=Math.min(tutorial.index,lessons.length-1);
 let lesson=lessons[tutorial.index],target=document.querySelector(lesson.target)||(lesson.fallback?document.querySelector(lesson.fallback):null);
 if(!target&&state.screen==='search'){tutorial.index=0;lesson=lessons[0];target=document.querySelector(lesson.target);}
 if(!target)return;
 target.classList.add('tour-target');target.setAttribute('aria-describedby','active-coach');
 const anchor=lesson.anchor?document.querySelector(lesson.anchor):target;
 if(!anchor)return;
 anchor.insertAdjacentHTML(lesson.before?'beforeend':'afterend',coachMarkup(lesson,lessons.length));
 const coach=document.querySelector('.coach-card');coach.id='active-coach';
 if(reveal){target.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'center'});const focus=target.matches('button,input')?target:target.querySelector('button,input');focus?.focus({preventScroll:true});}
}
function reducedMotion(){return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;}
const lessonTransition={busy:false,phase:'idle',token:0,timers:[]};
function clearLessonMotion(){app.classList.remove('lesson-leaving','lesson-entering');app.removeAttribute('aria-busy');}
function cancelLessonTransition(){lessonTransition.token++;lessonTransition.timers.forEach(clearTimeout);lessonTransition.timers=[];lessonTransition.busy=false;lessonTransition.phase='idle';clearLessonMotion();}
function revealCoachTarget(){const target=document.querySelector('.tour-target');if(!target)return;target.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'center'});const focus=target.matches('button,input')?target:target.querySelector('button,input');focus?.focus({preventScroll:true});}
function transitionLesson(index,reveal=false){
 if(lessonTransition.busy)return;
 const lessons=tourLessons(),next=Math.max(0,Math.min(lessons.length-1,index));
 if(next===tutorial.index&&!tutorial.hidden){if(reveal)revealCoachTarget();return;}
 const key=tourKey(),token=++lessonTransition.token;
 const commit=()=>{
  tutorial.index=next;tutorial.hidden=false;const lesson=lessons[next];
  if(lesson.tab){state.tab=lesson.tab;render(false);}else mountCoach();
  if(reveal)revealCoachTarget();
 };
 if(reducedMotion()){commit();return;}
 lessonTransition.busy=true;lessonTransition.phase='leaving';app.setAttribute('aria-busy','true');app.classList.add('lesson-leaving');
 // Timers are the fallback as well as the clock: no dependency on View Transitions or animationend.
 lessonTransition.timers.push(setTimeout(()=>{if(token===lessonTransition.token)lessonTransition.phase='pause';},240));
 lessonTransition.timers.push(setTimeout(()=>{
  if(token!==lessonTransition.token||key!==tourKey())return;
  app.classList.remove('lesson-leaving');commit();
  if(reducedMotion()){cancelLessonTransition();return;}
  lessonTransition.phase='entering';app.classList.add('lesson-entering');
  lessonTransition.timers.push(setTimeout(()=>{if(token===lessonTransition.token)cancelLessonTransition();},440));
 },340));
}
function changeTip(delta){transitionLesson(tutorial.index+delta,true);}
function reviewTip(){tutorial.hidden=false;mountCoach(true);}
function prepareTour(){const key=tourKey();if(key!==tutorial.key){tutorial.key=key;tutorial.index=state.screen==='search'&&state.submitted?2:0;tutorial.hidden=false;}if(state.screen==='calendar'){tutorial.index=state.time?2:state.day?1:0;}}
function updateGuide(){document.querySelectorAll('#steps li').forEach((li,i)=>li.classList.toggle('current',i===tourStep()));}
