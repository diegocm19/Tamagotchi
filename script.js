const pet = {
  name: 'Mochi',
  state: 'idle',
  actionLocked: false,
  hunger: 35,
  happiness: 70,
  hygiene: 65,
  energy: 75,
  health: 100,
  message: '¡Estoy listo para jugar!'
};

const stateInfo = {
  idle: { label: 'Feliz', color: '#4caf50' },
  feeding: { label: 'Comiendo', color: '#ff9f43' },
  playing: { label: 'Jugando', color: '#8e6bff' },
  cleaning: { label: 'Limpieza', color: '#2ecc71' },
  sleeping: { label: 'Dormido', color: '#5f6cfa' },
  healing: { label: 'Curándose', color: '#00bcd4' },
  hungry: { label: 'Hambriento', color: '#efb15f' },
  dirty: { label: 'Sucio', color: '#f39c12' },
  sleepy: { label: 'Somnoliento', color: '#6c63ff' },
  sick: { label: 'Enfermo', color: '#d65a4a' },
  dead: { label: 'Muerto', color: '#3d3d3d' }
};

const stateMachine = {
  idle: {
    onTick(pet) {
      pet.hunger += 6;
      pet.hygiene -= 4;
      pet.energy -= 3;
      pet.happiness -= 1;
      return determineNextState(pet);
    }
  },
  feeding: {
    onTick(pet) {
      pet.hunger = clamp(pet.hunger - 12);
      pet.happiness = clamp(pet.happiness + 8);
      pet.health = clamp(pet.health + 4);
      return 'idle';
    }
  },
  playing: {
    onTick(pet) {
      pet.happiness = clamp(pet.happiness + 10);
      pet.energy = clamp(pet.energy - 12);
      pet.hunger = clamp(pet.hunger + 9);
      return determineNextState(pet);
    }
  },
  cleaning: {
    onTick(pet) {
      pet.hygiene = clamp(pet.hygiene + 18);
      pet.happiness = clamp(pet.happiness + 5);
      return determineNextState(pet);
    }
  },
  sleeping: {
    onTick(pet) {
      pet.energy = clamp(pet.energy + 18);
      pet.hunger = clamp(pet.hunger + 6);
      pet.happiness = clamp(pet.happiness + 2);
      return determineNextState(pet);
    }
  },
  healing: {
    onTick(pet) {
      pet.health = clamp(pet.health + 18);
      pet.happiness = clamp(pet.happiness + 4);
      return determineNextState(pet);
    }
  },
  hungry: {
    onTick(pet) {
      pet.hunger += 8;
      pet.energy -= 6;
      pet.health -= 5;
      return determineNextState(pet);
    }
  },
  dirty: {
    onTick(pet) {
      pet.hygiene -= 10;
      pet.happiness -= 7;
      pet.health -= 4;
      return determineNextState(pet);
    }
  },
  sleepy: {
    onTick(pet) {
      pet.energy += 10;
      pet.hunger += 4;
      pet.happiness -= 2;
      return determineNextState(pet);
    }
  },
  sick: {
    onTick(pet) {
      pet.health -= 9;
      pet.happiness -= 8;
      pet.energy -= 4;
      return determineNextState(pet);
    }
  },
  dead: {
    onTick() {
      return 'dead';
    }
  }
};

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function determineNextState(currentPet) {
  if (currentPet.health <= 0) return 'dead';
  if (currentPet.hunger >= 85) return 'hungry';
  if (currentPet.hygiene <= 25) return 'dirty';
  if (currentPet.energy <= 20) return 'sleepy';
  if (currentPet.health <= 35) return 'sick';

  if (currentPet.hunger <= 45 && currentPet.hygiene >= 50 && currentPet.energy >= 35 && currentPet.health > 35) {
    return 'idle';
  }

  return 'idle';
}

function applyStatsDecay() {
  if (pet.state === 'dead') return;

  if (pet.hunger < 25) {
    pet.health = clamp(pet.health - 3);
  }

  if (pet.happiness < 30) {
    pet.health = clamp(pet.health - 2);
  }

  if (pet.hunger > 75) {
    pet.health = clamp(pet.health - 1);
  }
}

function setState(nextState, customMessage) {
  if (!stateInfo[nextState]) return;

  pet.state = nextState;
  pet.message = customMessage || getStateMessage(nextState);
  updateStatusBadge();
  updatePetVisual();
  refreshButtons();
}

function getStateMessage(state) {
  const messages = {
    idle: '¡Estoy feliz y listo para jugar!',
    feeding: '¡Qué rico! Estoy comiendo.',
    playing: '¡Me encanta jugar contigo!',
    cleaning: 'Ya estoy limpio y reluciente.',
    sleeping: 'Zzz...Estoy descansando.',
    healing: 'Gracias por cuidarme, ya me siento mejor.',
    hungry: '¡Tengo hambre! Necesito comer.',
    dirty: 'Necesito un baño, estoy muy sucio.',
    sleepy: 'Tengo sueño... deja que duerma un poco.',
    sick: 'Me siento mal. ¡Necesito ayuda!',
    dead: 'Mi energía se fue... ya no puedo seguir.'
  };

  return messages[state] || 'Estoy aquí.';
}

function updateStatusBadge() {
  const badge = document.getElementById('stateBadge');
  const info = stateInfo[pet.state] || stateInfo.idle;
  badge.textContent = info.label;
  badge.style.background = `${info.color}22`;
  badge.style.color = info.color;
}

function updatePetVisual() {
  const sprite = document.getElementById('petSprite');
  sprite.className = `pet-sprite state-${pet.state}`;
}

function renderStats() {
  const stats = {
    hungerBar: pet.hunger,
    happinessBar: pet.happiness,
    hygieneBar: pet.hygiene,
    energyBar: pet.energy,
    healthBar: pet.health
  };

  Object.entries(stats).forEach(([id, value]) => {
    const element = document.getElementById(id);
    element.style.width = `${clamp(value)}%`;

    if (value < 35) {
      element.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
    } else if (value < 70) {
      element.style.background = 'linear-gradient(90deg, #f59e0b, #facc15)';
    } else {
      element.style.background = 'linear-gradient(90deg, #4ade80, #22c55e)';
    }
  });
}

function refreshButtons() {
  const buttons = document.querySelectorAll('button[data-action]');
  buttons.forEach((button) => {
    const action = button.dataset.action;
    const actionStates = ['feeding', 'playing', 'cleaning', 'sleeping', 'healing'];
    const isActionInProgress = actionStates.includes(pet.state);
    const isCurrentAction = pet.state === {
      feed: 'feeding',
      play: 'playing',
      clean: 'cleaning',
      sleep: 'sleeping',
      heal: 'healing'
    }[action];

    button.disabled = pet.actionLocked || (isActionInProgress && !isCurrentAction) || pet.state === 'dead';
  });
}

function render() {
  const message = document.getElementById('message');
  message.textContent = pet.message;
  renderStats();
  updateStatusBadge();
  updatePetVisual();
  refreshButtons();
}

function actionTimeout(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (action) {
        case 'feed':
          pet.hunger = clamp(pet.hunger - 28);
          pet.happiness = clamp(pet.happiness + 10);
          pet.health = clamp(pet.health + 8);
          break;
        case 'play':
          pet.happiness = clamp(pet.happiness + 18);
          pet.energy = clamp(pet.energy - 10);
          pet.hunger = clamp(pet.hunger + 12);
          break;
        case 'clean':
          pet.hygiene = clamp(pet.hygiene + 30);
          pet.happiness = clamp(pet.happiness + 8);
          pet.health = clamp(pet.health + 8);
          break;
        case 'sleep':
          pet.energy = clamp(pet.energy + 25);
          pet.hunger = clamp(pet.hunger + 6);
          pet.happiness = clamp(pet.happiness + 4);
          break;
        case 'heal':
          pet.health = clamp(pet.health + 25);
          pet.happiness = clamp(pet.happiness + 5);
          break;
        default:
          break;
      }

      const nextState = determineNextState(pet);
      pet.actionLocked = false;
      applyStatsDecay();
      setState(nextState, getStateMessage(nextState));
      render();
      resolve();
    }, 1200);
  });
}

function applyAction(action) {
  if (pet.state === 'dead' || pet.actionLocked) return;

  pet.actionLocked = true;

  const transitionMap = {
    feed: 'feeding',
    play: 'playing',
    clean: 'cleaning',
    sleep: 'sleeping',
    heal: 'healing'
  };

  const nextState = transitionMap[action] || 'idle';
  setState(nextState, getStateMessage(nextState));
  render();
  actionTimeout(action);
}

function advanceTime() {
  if (pet.state === 'dead' || pet.actionLocked) {
    render();
    return;
  }

  const nextState = stateMachine[pet.state].onTick(pet);
  applyStatsDecay();

  if (nextState !== pet.state) {
    setState(nextState, getStateMessage(nextState));
  }

  render();
}

function init() {
  render();
  document.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', () => applyAction(button.dataset.action));
  });

  setInterval(advanceTime, 2000);
}

init();
