document.addEventListener('DOMContentLoaded', () => {
  const tenisContainer = document.getElementById('tenisContainer');
  const tenisForm = document.getElementById('tenisForm');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  // URL do servidor GraphQL
  const GRAPHQL_URL = 'http://localhost:4000/graphql';

  // Função para fazer requisições GraphQL
  async function fetchGraphQL(query, variables = {}) {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    return await response.json();
  }

  // Carregar todos os tênis
  async function loadTenis() {
    const query = `
      query {
        tenis {
          id
          nome
          marca
          preco
          tamanho
          cor
          lancamento
        }
      }
    `;

    const { data } = await fetchGraphQL(query);
    displayTenis(data.tenis);
  }

  // Buscar tênis por marca
  async function searchTenisByBrand(brand) {
    const query = `
      query TenisPorMarca($marca: String!) {
        tenisPorMarca(marca: $marca) {
          id
          nome
          marca
          preco
          tamanho
          cor
          lancamento
        }
      }
    `;

    const { data } = await fetchGraphQL(query, { marca: brand });
    displayTenis(data.tenisPorMarca);
  }

  // Adicionar novo tênis
  async function addTenis(tenis) {
    const mutation = `
      mutation AdicionarTenis(
        $nome: String!,
        $marca: String!,
        $preco: Int!,
        $tamanho: Int!,
        $cor: String!,
        $lancamento: String!
      ) {
        adicionarTenis(
          nome: $nome,
          marca: $marca,
          preco: $preco,
          tamanho: $tamanho,
          cor: $cor,
          lancamento: $lancamento
        ) {
          id
          nome
        }
      }
    `;

    await fetchGraphQL(mutation, tenis);
    loadTenis();
  }

  // Remover tênis
  async function removeTenis(id) {
    const mutation = `
      mutation RemoverTenis($id: ID!) {
        removerTenis(id: $id) {
          id
          nome
        }
      }
    `;

    await fetchGraphQL(mutation, { id });
    loadTenis();
  }

  // Exibir tênis na tela
  function displayTenis(tenisList) {
    tenisContainer.innerHTML = '';

    if (tenisList.length === 0) {
      tenisContainer.innerHTML = '<p>Nenhum tênis encontrado.</p>';
      return;
    }

    tenisList.forEach(tenis => {
      const tenisCard = document.createElement('div');
      tenisCard.className = 'tenis-card';
      
      // Emoji baseado na marca (simplificado)
      let emoji = '👟';
      if (tenis.marca.toLowerCase().includes('nike')) emoji = '✔️';
      if (tenis.marca.toLowerCase().includes('adidas')) emoji = '🔷';
      if (tenis.marca.toLowerCase().includes('reebok')) emoji = '⚡';
      
      tenisCard.innerHTML = `
        <div class="tenis-img">${emoji}</div>
        <div class="tenis-info">
          <h4>${tenis.nome}</h4>
          <p><strong>Marca:</strong> ${tenis.marca}</p>
          <p><strong>Cor:</strong> ${tenis.cor}</p>
          <p><strong>Tamanho:</strong> ${tenis.tamanho}</p>
          <p><strong>Lançamento:</strong> ${tenis.lancamento}</p>
          <p class="price">R$ ${tenis.preco.toFixed(2)}</p>
          <button class="delete-btn" data-id="${tenis.id}">Remover</button>
        </div>
      `;
      
      tenisContainer.appendChild(tenisCard);
    });

    // Adicionar eventos aos botões de remover
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (confirm('Tem certeza que deseja remover este tênis?')) {
          removeTenis(e.target.dataset.id);
        }
      });
    });
  }

  // Evento de envio do formulário
  tenisForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const tenis = {
      nome: document.getElementById('nome').value,
      marca: document.getElementById('marca').value,
      preco: parseInt(document.getElementById('preco').value),
      tamanho: parseInt(document.getElementById('tamanho').value),
      cor: document.getElementById('cor').value,
      lancamento: document.getElementById('lancamento').value
    };
    
    addTenis(tenis);
    tenisForm.reset();
  });

  // Evento de busca
  searchBtn.addEventListener('click', () => {
    const brand = searchInput.value.trim();
    if (brand) {
      searchTenisByBrand(brand);
    } else {
      loadTenis();
    }
  });

  // Carregar tênis ao iniciar
  loadTenis();
});