/* =========================================
   TEMA DARK / LIGHT
   ========================================= */
(function () {
  const savedTheme = localStorage.getItem('bemestar_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
})();

function toggleTheme() {
  const body = document.body;
  const icon = document.querySelector('.theme-toggle i');
  body.classList.toggle('dark-theme');

  if (body.classList.contains('dark-theme')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('bemestar_theme', 'dark');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('bemestar_theme', 'light');
  }
}

// Aplica ícone correto ao carregar
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('bemestar_theme') === 'dark') {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) icon.classList.replace('fa-moon', 'fa-sun');
  }
});

/* =========================================
   SCROLL REVEAL — com direções variadas
   ========================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // dispara só uma vez
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.reveal').forEach((el, index) => {
  // Alterna direção de reveal para variedade
  if (index % 3 === 1) el.classList.add('from-left');
  if (index % 3 === 2) el.classList.add('from-right');
  revealObserver.observe(el);
});

/* =========================================
   CARROSSEL — TOQUE / ARRASTE
   ========================================= */
const track = document.querySelector('.carousel-track-manual');
if (track) {
  let isDown = false, startX, scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  track.style.cursor = 'grab';
}

/* =========================================
   SERVICE CARD — SELEÇÃO + SCROLL
   ========================================= */
function selectService(serviceName) {
  const select = document.getElementById('eventType');
  let found = false;
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
      select.selectedIndex = i;
      found = true;
      break;
    }
  }
  if (!found) select.value = 'Outro';

  const target = document.getElementById('agendamento');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =========================================
   CAMPO ANDAR — MOSTRAR / OCULTAR
   ========================================= */
function toggleAndar(valor) {
  const grupo = document.getElementById('group-andar');
  if (!grupo) return;
  if (valor === 'Andar') {
    grupo.style.display = 'block';
  } else {
    grupo.style.display = 'none';
    const input = document.getElementById('floorNumber');
    if (input) input.value = '';
  }
}

/* =========================================
   ENVIAR ORÇAMENTO VIA WHATSAPP
   ========================================= */
function enviarOrcamento() {
  const nome       = document.getElementById('clientName').value.trim();
  const tipo       = document.getElementById('eventType').value;
  const local      = document.getElementById('installLocation').value;
  const parede     = document.getElementById('wallType').value;
  const floorType  = document.getElementById('floorType').value;
  const floorNum   = document.getElementById('floorNumber').value.trim();
  const modelo     = document.getElementById('airModel').value;
  const btus       = document.getElementById('airBTUs').value;
  const qtd        = document.getElementById('airQty').value;
  const problema   = document.getElementById('problemDesc').value.trim();
  const obs        = document.getElementById('obs').value.trim();

  if (!nome || !tipo) {
    // Feedback visual sutil ao invés de alert
    const btn = document.querySelector('.btn-schedule');
    btn.style.animation = 'none';
    btn.style.background = 'linear-gradient(135deg, #c0392b, #e74c3c)';
    btn.textContent = '⚠ Preencha Nome e Serviço';
    setTimeout(() => {
      btn.style.background = '';
      btn.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i> Enviar no WhatsApp';
    }, 2500);
    return;
  }

  let msg = `Olá, equipe Bem Estar! ❄️%0A%0A`;
  msg += `*Solicitação de Atendimento*%0A`;
  msg += `━━━━━━━━━━━━━━━━━%0A`;
  msg += `👤 *Cliente:* ${nome}%0A`;
  msg += `🛠 *Serviço:* ${tipo}%0A`;
  if (local !== 'Não se aplica') msg += `🏠 *Local:* ${local}%0A`;
  if (floorType !== 'Não se aplica') {
    const andarInfo = (floorType === 'Andar' && floorNum) ? `${floorType} — ${floorNum}º andar` : floorType;
    msg += `🏢 *Altura:* ${andarInfo}%0A`;
  }
  if (parede !== 'Não se aplica') msg += `🧱 *Parede:* ${parede}%0A`;
  msg += `❄️ *Aparelho:* ${modelo} (${btus})%0A`;
  msg += `🔢 *Quantidade:* ${qtd} unid.%0A`;
  if (problema) msg += `%0A🚨 *Problema Relatado:*%0A${problema}%0A`;
  if (obs)      msg += `%0A📝 *Observações/Acesso:*%0A${obs}%0A`;
  msg += `%0A━━━━━━━━━━━━━━━━━%0AAguardo o contato para confirmar o agendamento!`;

  const telefone = '5532984435924'; // ← SUBSTITUA PELO SEU NÚMERO
  window.open(`https://wa.me/${telefone}?text=${msg}`, '_blank');
}

/* =========================================
   FAQ — ACORDEÃO COM ARIA
   ========================================= */
function toggleFaq(element) {
  const allFaqs = document.querySelectorAll('.faq-item');
  const btn = element.querySelector('.faq-question');
  const isAlreadyOpen = element.classList.contains('active');

  allFaqs.forEach((item) => {
    item.classList.remove('active');
    const q = item.querySelector('.faq-question');
    if (q) q.setAttribute('aria-expanded', 'false');
  });

  if (!isAlreadyOpen) {
    element.classList.add('active');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}

/* =========================================
   SERVICE CARD — SUPORTE A TECLADO
   ========================================= */
document.querySelectorAll('.service-card').forEach((card) => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});