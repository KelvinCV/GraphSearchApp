        // Classe Node para representar um vértice
        class Node {
            constructor(name, x, y) {
                this.name = name;
                this.x = x;
                this.y = y;
                this.neighbors = [];
            }

            addNeighbor(neighbor) {
                this.neighbors.push(neighbor);
            }
        }

        // Classe Graph para representar o grafo
        class Graph {
            constructor() {
                this.nodes = new Map();
            }

            addNode(node) {
                this.nodes.set(node.name, node);
            }

            getNode(name) {
                return this.nodes.get(name);
            }
        }

        // Classe PriorityQueue para a implementação da fila de prioridade
        class PriorityQueue {
            constructor() {
                this.elements = [];
            }

            enqueue(element, priority) {
                const queueElement = { element, priority };

                if (this.isEmpty()) {
                    this.elements.push(queueElement);
                } else {
                    let added = false;
                    for (let i = 0; i < this.elements.length; i++) {
                        if (queueElement.priority < this.elements[i].priority) {
                            this.elements.splice(i, 0, queueElement);
                            added = true;
                            break;
                        }
                    }
                    if (!added) {
                        this.elements.push(queueElement);
                    }
                }
            }

            dequeue() {
                if (this.isEmpty()) {
                    return null;
                }
                return this.elements.shift();
            }

            isEmpty() {
                return this.elements.length === 0;
            }
        }

        // Criação do grafo de exemplo
        const graph = new Graph();

        // Função para gerar nomes únicos
        function generateNodeName(index) {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const letter = alphabet[index % alphabet.length];
            const number = Math.floor(index / alphabet.length);
            return number > 0 ? letter + number : letter;
        }

        // Criação dos nós
        const numNodes = 1000; // Defina o número de vértices desejado
        const gridSize = Math.ceil(Math.sqrt(numNodes));
        const nodeSize = 40;
        const padding = 20;
        const startX = padding + nodeSize / 2;
        const startY = padding + nodeSize / 2;

        for (let i = 0; i < numNodes; i++) {
            const x = startX + (i % gridSize) * (nodeSize + padding);
            const y = startY + Math.floor(i / gridSize) * (nodeSize + padding);
            const nodeName = generateNodeName(i);
            const node = new Node(nodeName, x, y);
            graph.addNode(node);
        }

        // Conecta os nós adjacentes na rede quadrada
        const nodesArray = Array.from(graph.nodes.values());

        for (let i = 0; i < nodesArray.length; i++) {
            const currentNode = nodesArray[i];

            if (i > 0) {
                const previousNode = nodesArray[i - 1];
                currentNode.addNeighbor(previousNode);
                previousNode.addNeighbor(currentNode);
            }

            if (i >= gridSize) {
                const topNode = nodesArray[i - gridSize];
                currentNode.addNeighbor(topNode);
                topNode.addNeighbor(currentNode);
            }
        }

        function drawGraph(visitedNodes, pathNodes) {
    const canvas = document.getElementById("graphCanvas");
    const context = canvas.getContext("2d");
    const nodeRadius = 10;
    const nodeColor = "#000000";
    const visitedColor = "#f54242";
    const pathColor = "#42f58c";
    const fontSize = "12px";

    // Limpa o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha os nós
    for (const node of graph.nodes.values()) {
        context.beginPath();
        context.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = nodeColor;
        context.fill();
        context.closePath();

        // Exibe o nome do nó
        context.font = fontSize;
        context.fillStyle = "#FF0000";
        context.textAlign = "center";
        context.fillText(node.name, node.x, node.y + nodeRadius + 12);
    }

    // Desenha as arestas
    for (const node of graph.nodes.values()) {
        for (const neighbor of node.neighbors) {
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.strokeStyle = nodeColor;
            context.stroke();
            context.closePath();
        }
    }

    // Destaca os nós visitados
    for (const visitedNode of visitedNodes) {
        const node = graph.getNode(visitedNode);
        context.beginPath();
        context.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = visitedColor;
        context.fill();
        context.closePath();

        // Exibe o nome do nó visitado
        context.font = fontSize;
        context.fillStyle = "#6385ff";
        context.textAlign = "center";
        context.fillText(node.name, node.x, node.y + nodeRadius + 12);
    }

    // Destaca o caminho encontrado
    if (pathNodes.length > 0) {
        context.beginPath();
        context.moveTo(pathNodes[0].x, pathNodes[0].y);
        context.strokeStyle = pathColor;
        context.lineWidth = 3;
        for (let i = 1; i < pathNodes.length; i++) {
            context.lineTo(pathNodes[i].x, pathNodes[i].y);
        }
        context.stroke();
        context.closePath();
    }
}


        // Preenche as opções dos seletores de origem e destino
        const originSelect = document.getElementById("originNode");
        const destinationSelect = document.getElementById("destinationNode");

        for (const node of graph.nodes.values()) {
        const option = document.createElement("option");
        option.text = node.name;
        originSelect.add(option);

        const option2 = document.createElement("option");
        option2.text = node.name;
        destinationSelect.add(option2);
        }

        // Função para exibir o resultado
        function showResult(result) {
        const resultContainer = document.getElementById("resultContainer");
        resultContainer.innerHTML = result;
        }

        // Função de busca em largura (BFS)
        function bfsSearch() {
        const originNode = originSelect.value;
        const destinationNode = destinationSelect.value;

        const queue = [];
        const visited = new Set();
        const path = new Map();

        queue.push(originNode);
        visited.add(originNode);

        while (queue.length > 0) {
            const currentNode = queue.shift();

            if (currentNode === destinationNode) {
                const pathNodes = [];
                let node = destinationNode;
                while (node !== originNode) {
                    pathNodes.unshift(graph.getNode(node));
                    node = path.get(node);
                }
                pathNodes.unshift(graph.getNode(originNode));
                drawGraph(Array.from(visited), pathNodes);
                showResult(`Caminho encontrado: ${pathNodes.map(node => node.name).join(" -> ")}`);
                return;
            }

            for (const neighbor of graph.getNode(currentNode).neighbors) {
                if (!visited.has(neighbor.name)) {
                    queue.push(neighbor.name);
                    visited.add(neighbor.name);
                    path.set(neighbor.name, currentNode);
                }
            }
        }

        drawGraph(Array.from(visited), []);
        showResult('Caminho não encontrado.');
}

    // Função de busca em profundidade (DFS)
    function dfsSearch() {
        const originNode = originSelect.value;
        const destinationNode = destinationSelect.value;

        const stack = [];
        const visited = new Set();
        const path = new Map();

        stack.push(originNode);
        visited.add(originNode);

        while (stack.length > 0) {
            const currentNode = stack.pop();

            if (currentNode === destinationNode) {
                const pathNodes = [];
                let node = destinationNode;
                while (node !== originNode) {
                    pathNodes.unshift(graph.getNode(node));
                    node = path.get(node);
                }
                pathNodes.unshift(graph.getNode(originNode));
                drawGraph(Array.from(visited), pathNodes);
                showResult(`Caminho encontrado: ${pathNodes.map(node => node.name).join(" -> ")}`);
                return;
            }

            for (const neighbor of graph.getNode(currentNode).neighbors) {
                if (!visited.has(neighbor.name)) {
                    stack.push(neighbor.name);
                    visited.add(neighbor.name);
                    path.set(neighbor.name, currentNode);
                }
            }
        }

        drawGraph(Array.from(visited), []);
        showResult(`Caminho não encontrado.`);
    }

    // Função de busca de custo uniforme (UCS)
    function ucsSearch() {
        const originNode = originSelect.value;
        const destinationNode = destinationSelect.value;

        const priorityQueue = new PriorityQueue();
        const visited = new Set();
        const path = new Map();
        const cost = new Map();

        priorityQueue.enqueue(originNode, 0);
        visited.add(originNode);
        cost.set(originNode, 0);

        while (!priorityQueue.isEmpty()) {
            const currentNode = priorityQueue.dequeue().element;

            if (currentNode === destinationNode) {
                const pathNodes = [];
                let node = destinationNode;
                while (node !== originNode) {
                    pathNodes.unshift(graph.getNode(node));
                    node = path.get(node);
                }
                pathNodes.unshift(graph.getNode(originNode));
                drawGraph(Array.from(visited), pathNodes);
                showResult(`Caminho encontrado: ${pathNodes.map(node => node.name).join(" -> ")}`);
                return;
            }

            for (const neighbor of graph.getNode(currentNode).neighbors) {
                const newCost = cost.get(currentNode) + 1; // Assume que todas as arestas têm peso 1

                if (!visited.has(neighbor.name) || newCost < cost.get(neighbor.name)) {
                    priorityQueue.enqueue(neighbor.name, newCost);
                    visited.add(neighbor.name);
                    path.set(neighbor.name, currentNode);
                    cost.set(neighbor.name, newCost);
                }
            }
        }

        drawGraph(Array.from(visited), []);
        showResult(`Caminho não encontrado.`);
    }

    // Função de busca gulosa (Greedy)
    function greedySearch() {
        const originNode = originSelect.value;
        const destinationNode = destinationSelect.value;

        const priorityQueue = new PriorityQueue();
        const visited = new Set();
        const path = new Map();
        const heuristic = new Map();

        priorityQueue.enqueue(originNode, 0);
        visited.add(originNode);

        while (!priorityQueue.isEmpty()) {
            const currentNode = priorityQueue.dequeue().element;

            if (currentNode === destinationNode) {
                const pathNodes = [];
                let node = destinationNode;
                while (node !== originNode) {
                    pathNodes.unshift(graph.getNode(node));
                    node = path.get(node);
                }
                pathNodes.unshift(graph.getNode(originNode));
                drawGraph(Array.from(visited), pathNodes);
               
                showResult(`Caminho encontrado: ${pathNodes.map(node => node.name).join(" -> ")}`);
                return;
                }

                for (const neighbor of graph.getNode(currentNode).neighbors) {
                if (!visited.has(neighbor.name)) {
                    const h = heuristicFunction(neighbor, graph.getNode(destinationNode));
                    priorityQueue.enqueue(neighbor.name, h);
                    visited.add(neighbor.name);
                    path.set(neighbor.name, currentNode);
                    heuristic.set(neighbor.name, h);
                }
            }
        }

        drawGraph(Array.from(visited), []);
        showResult(`Caminho não encontrado.`);
    }

    // Função de busca A* (A-Star)
    function aStarSearch() {
        const originNode = originSelect.value;
        const destinationNode = destinationSelect.value;

        const priorityQueue = new PriorityQueue();
        const visited = new Set();
        const path = new Map();
        const cost = new Map();
        const heuristic = new Map();

        priorityQueue.enqueue(originNode, 0);
        visited.add(originNode);
        cost.set(originNode, 0);

        while (!priorityQueue.isEmpty()) {
            const currentNode = priorityQueue.dequeue().element;

            if (currentNode === destinationNode) {
                const pathNodes = [];
                let node = destinationNode;
                while (node !== originNode) {
                    pathNodes.unshift(graph.getNode(node));
                    node = path.get(node);
                }
                pathNodes.unshift(graph.getNode(originNode));
                drawGraph(Array.from(visited), pathNodes);
                showResult(`Caminho encontrado: ${pathNodes.map(node => node.name).join(" -> ")}`);
                return;
            }

            for (const neighbor of graph.getNode(currentNode).neighbors) {
                const newCost = cost.get(currentNode) + 1; // Assume que todas as arestas têm peso 1

                if (!visited.has(neighbor.name) || newCost < cost.get(neighbor.name)) {
                    const h = heuristicFunction(neighbor, graph.getNode(destinationNode));
                    const priority = newCost + h;
                    priorityQueue.enqueue(neighbor.name, priority);
                    visited.add(neighbor.name);
                    path.set(neighbor.name, currentNode);
                    cost.set(neighbor.name, newCost);
                    heuristic.set(neighbor.name, h);
                }
            }
        }

        drawGraph(Array.from(visited), []);
        showResult(`Caminho não encontrado.`);
    }

    // Função de heurística para a busca gulosa e A*
    function heuristicFunction(node, destination) {
        // Distância Euclidiana entre os nós
        const dx = Math.abs(node.x - destination.x);
        const dy = Math.abs(node.y - destination.y);
        return Math.sqrt(dx * dx + dy * dy);
    }

            // Atribuição de eventos aos botões
    document.getElementById("bfsButton").addEventListener("click", bfsSearch);
    document.getElementById("dfsButton").addEventListener("click", dfsSearch);
    document.getElementById("ucsButton").addEventListener("click", ucsSearch);
    document.getElementById("greedyButton").addEventListener("click", greedySearch);
    document.getElementById("aStarButton").addEventListener("click", aStarSearch);

    // Função para limpar o resultado e o canvas
    function clearResult() {
        const resultContainer = document.getElementById("resultContainer");
        resultContainer.innerHTML = "";
        const canvas = document.getElementById("graphCanvas");
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Botão para limpar o resultado e o canvas
    document.getElementById("clearButton").addEventListener("click", clearResult);

    // Desenhar o grafo inicial
    drawGraph([], []);