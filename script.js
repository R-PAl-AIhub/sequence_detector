document.addEventListener('DOMContentLoaded', () => {
    const visualizeBtn = document.getElementById('visualizeBtn');
    const sequenceInput = document.getElementById('sequenceInput');
    const graphSvg = document.getElementById('graphSvg');
    const placeholderText = document.getElementById('placeholder-text');
    const overlapHint = document.getElementById('overlapHint');

    // Update overlap hint text based on selection
    const overlapRadios = document.querySelectorAll('input[name="overlapMode"]');
    overlapRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'overlapping') {
                overlapHint.textContent = 'Allow overlapping detections.';
            } else {
                overlapHint.textContent = 'Reset after each detection.';
            }
        });
    });

    // Define arrow markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
        refX="19" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" 
        refX="19" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
        </marker>
        <marker id="arrowhead-visited" markerWidth="10" markerHeight="7" 
        refX="19" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa"/>
        </marker>
    `;
    graphSvg.appendChild(defs);

    let currentStates = [];
    let currentTransitions = [];
    let currentPattern = '';
    let currentMachineType = '';
    let currentOverlapMode = '';
    let testTrace = [];
    let currentStepIndex = -1;

    visualizeBtn.addEventListener('click', () => {
        const sequence = sequenceInput.value.trim();
        if (!sequence || !/^[01]+$/.test(sequence)) {
            alert('Please enter a valid binary sequence (e.g., 101).');
            return;
        }

        const machineType = document.querySelector('input[name="machineType"]:checked').value;
        const overlapMode = document.querySelector('input[name="overlapMode"]:checked').value;

        currentPattern = sequence;
        currentMachineType = machineType;
        currentOverlapMode = overlapMode;

        generateAndRenderGraph(sequence, machineType, overlapMode);

        // Store states and transitions for testing
        storeStatesAndTransitions(sequence, machineType, overlapMode);

        // Reset test UI
        const stepNavigation = document.getElementById('stepNavigation');
        const testResult = document.getElementById('testResult');
        stepNavigation.classList.remove('active');
        testResult.style.display = 'none';
        testResult.classList.remove('success', 'error');
    });

    function generateAndRenderGraph(sequence, type, overlap) {
        placeholderText.style.display = 'none';

        // Clear previous graph (keep defs)
        while (graphSvg.lastChild && graphSvg.lastChild.tagName !== 'defs') {
            graphSvg.removeChild(graphSvg.lastChild);
        }

        const states = [];
        const transitions = [];
        const isMoore = type === 'moore';
        const isOverlapping = overlap === 'overlapping';

        // Generate States
        const numStates = isMoore ? sequence.length + 1 : sequence.length;

        for (let i = 0; i < numStates; i++) {
            let label = String.fromCharCode(65 + i);
            let output = '';
            let prefix = sequence.substring(0, i);

            if (isMoore) {
                output = (i === sequence.length) ? '1' : '0';
                states.push({ id: i, label: `${label}/${output}`, x: 0, y: 0, prefix: prefix });
            } else {
                states.push({ id: i, label: label, x: 0, y: 0, prefix: prefix });
            }
        }

        // Generate Transitions
        for (let i = 0; i < numStates; i++) {
            const currentPrefix = sequence.substring(0, i);

            ['0', '1'].forEach(inputChar => {
                let nextStateIndex;
                let output = '0';
                let candidate = currentPrefix + inputChar;

                if (candidate === sequence) {
                    output = '1';
                    if (isOverlapping) {
                        if (isMoore) {
                            nextStateIndex = sequence.length;
                        } else {
                            nextStateIndex = getLongestPrefixLength(sequence, candidate.substring(1));
                        }
                    } else {
                        if (isMoore) {
                            nextStateIndex = sequence.length;
                        } else {
                            nextStateIndex = 0;
                        }
                    }
                } else if (candidate.length > sequence.length) {
                    if (isOverlapping) {
                        nextStateIndex = getLongestPrefixLength(sequence, candidate);
                    } else {
                        nextStateIndex = getLongestPrefixLength(sequence, inputChar);
                    }
                } else {
                    nextStateIndex = getLongestPrefixLength(sequence, candidate);
                }

                let edgeLabel = isMoore ? inputChar : `${inputChar}/${output}`;

                transitions.push({
                    from: i,
                    to: nextStateIndex,
                    label: edgeLabel,
                    input: inputChar
                });
            });
        }

        renderGraph(states, transitions);
    }

    function storeStatesAndTransitions(sequence, type, overlap) {
        const isMoore = type === 'moore';
        const isOverlapping = overlap === 'overlapping';
        const numStates = isMoore ? sequence.length + 1 : sequence.length;

        currentStates = [];
        currentTransitions = [];

        for (let i = 0; i < numStates; i++) {
            let label = String.fromCharCode(65 + i);
            let output = '';
            let prefix = sequence.substring(0, i);

            if (isMoore) {
                output = (i === sequence.length) ? '1' : '0';
                currentStates.push({ id: i, label: `${label}/${output}`, prefix: prefix });
            } else {
                currentStates.push({ id: i, label: label, prefix: prefix });
            }
        }

        for (let i = 0; i < numStates; i++) {
            const currentPrefix = sequence.substring(0, i);

            ['0', '1'].forEach(inputChar => {
                let nextStateIndex;
                let output = '0';
                let candidate = currentPrefix + inputChar;

                if (candidate === sequence) {
                    output = '1';
                    if (isOverlapping) {
                        if (isMoore) {
                            nextStateIndex = sequence.length;
                        } else {
                            nextStateIndex = getLongestPrefixLength(sequence, candidate.substring(1));
                        }
                    } else {
                        if (isMoore) {
                            nextStateIndex = sequence.length;
                        } else {
                            nextStateIndex = 0;
                        }
                    }
                } else if (candidate.length > sequence.length) {
                    if (isOverlapping) {
                        nextStateIndex = getLongestPrefixLength(sequence, candidate);
                    } else {
                        nextStateIndex = getLongestPrefixLength(sequence, inputChar);
                    }
                } else {
                    nextStateIndex = getLongestPrefixLength(sequence, candidate);
                }

                currentTransitions.push({
                    from: i,
                    to: nextStateIndex,
                    input: inputChar,
                    output: output
                });
            });
        }
    }

    function getLongestPrefixLength(pattern, text) {
        for (let len = Math.min(pattern.length, text.length); len > 0; len--) {
            if (text.endsWith(pattern.substring(0, len))) {
                return len;
            }
        }
        return 0;
    }

    function renderGraph(states, transitions) {
        const svgWidth = graphSvg.clientWidth;
        const svgHeight = graphSvg.clientHeight;
        const nodeRadius = 25;
        const spacing = Math.min(150, (svgWidth - 100) / (states.length - 1 || 1));
        const startX = (svgWidth - (states.length - 1) * spacing) / 2;
        const startY = svgHeight / 2;

        console.log('Rendering graph:', {
            numStates: states.length,
            svgWidth,
            svgHeight,
            spacing,
            startX,
            startY
        });

        states.forEach((state, index) => {
            state.x = startX + index * spacing;
            state.y = startY;
            console.log(`State ${state.label}: x=${state.x}, y=${state.y}`);
        });

        // Draw Edges first
        transitions.forEach(t => {
            const start = states[t.from];
            const end = states[t.to];

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'edge');
            g.setAttribute('data-edge', `${t.from}-${t.input}`);

            if (t.from === t.to) {
                drawSelfLoop(g, start, t.label, t.label === '1' || t.label.startsWith('1'));
            } else {
                drawEdge(g, start, end, t.label, t.from, t.to);
            }

            graphSvg.appendChild(g);
        });

        // Draw Nodes on top
        states.forEach((state, index) => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', `node ${index === 0 ? 'start-node' : ''}`);
            g.setAttribute('transform', `translate(${state.x}, ${state.y})`);
            g.setAttribute('data-state-id', state.id);

            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `Prefix: ${state.prefix || '(empty)'}`;
            g.appendChild(title);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', nodeRadius);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.textContent = state.label;
            text.setAttribute('dy', '1');

            g.appendChild(circle);
            g.appendChild(text);
            graphSvg.appendChild(g);

            console.log(`Rendered node ${state.label} at (${state.x}, ${state.y})`);
        });
    }

    function drawSelfLoop(container, node, label, isTop) {
        const r = 25;
        const loopHeight = 50;
        const direction = -1; // Always UP

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startX = node.x - 10;
        const startY = node.y + (direction * r * 0.8);
        const endX = node.x + 10;
        const endY = node.y + (direction * r * 0.8);

        const d = `M ${startX} ${startY} 
                   C ${node.x - 30} ${node.y + direction * loopHeight}, 
                     ${node.x + 30} ${node.y + direction * loopHeight}, 
                     ${endX} ${endY}`;

        path.setAttribute('d', d);

        const labelX = node.x;
        const labelY = node.y + direction * (loopHeight + 15);

        container.appendChild(path);
        createLabel(container, label, labelX, labelY);
    }

    function drawEdge(container, start, end, label, fromIdx, toIdx) {
        const r = 25;
        const isForward = toIdx > fromIdx;
        const dist = Math.abs(toIdx - fromIdx);

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = '';
        let labelX, labelY;

        if (isForward && dist === 1) {
            // MAIN HIGHWAY: Straight line
            const startX = start.x + r;
            const endX = end.x - r - 5;
            d = `M ${startX} ${start.y} L ${endX} ${start.y}`;

            labelX = (startX + endX) / 2;
            labelY = start.y - 12;
        } else if (isForward) {
            // JUMP FORWARD: Arc UP
            const height = 40 + (dist * 10);
            const startX = start.x + 10;
            const startY = start.y - r * 0.5;
            const endX = end.x - 10;
            const endY = end.y - r * 0.5;

            d = `M ${startX} ${startY} Q ${(startX + endX) / 2} ${start.y - height} ${endX} ${endY}`;

            labelX = (startX + endX) / 2;
            labelY = start.y - height - 10;
        } else {
            // FEEDBACK: Arc DOWN
            const height = 50 + (dist * 15);
            const startX = start.x;
            const startY = start.y + r;
            const endX = end.x;
            const endY = end.y + r;

            d = `M ${startX} ${startY} Q ${(startX + endX) / 2} ${start.y + height} ${endX} ${endY}`;

            labelX = (startX + endX) / 2;
            labelY = start.y + height + 5;
        }

        path.setAttribute('d', d);

        container.appendChild(path);
        createLabel(container, label, labelX, labelY);
    }

    function createLabel(container, text, x, y) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        // Background pill for text
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const width = text.length * 8 + 14;
        const height = 20;

        rect.setAttribute('x', x - width / 2);
        rect.setAttribute('y', y - height / 2);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('rx', 4);
        rect.setAttribute('fill', '#0f172a');
        rect.setAttribute('opacity', '0.8');

        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.textContent = text;
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);
        textEl.setAttribute('text-anchor', 'middle');
        textEl.setAttribute('dominant-baseline', 'middle');

        group.appendChild(rect);
        group.appendChild(textEl);
        container.appendChild(group);
    }

    // Test functionality
    const testBtn = document.getElementById('testBtn');
    const testInput = document.getElementById('testInput');
    const testResult = document.getElementById('testResult');
    const stepNavigation = document.getElementById('stepNavigation');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const resetBtn = document.getElementById('resetBtn');
    const stepInfo = document.getElementById('stepInfo');

    testBtn.addEventListener('click', () => {
        const input = testInput.value.trim();

        if (!currentPattern) {
            testResult.className = 'test-result error';
            testResult.innerHTML = '<strong>Error:</strong> Please generate a state machine first.';
            testResult.style.display = 'block';
            return;
        }

        if (!input || !/^[01]*$/.test(input)) {
            testResult.className = 'test-result error';
            testResult.innerHTML = '<strong>Error:</strong> Please enter a valid binary sequence.';
            testResult.style.display = 'block';
            return;
        }

        runTest(input);
    });

    function runTest(input) {
        const isMoore = currentMachineType === 'moore';
        let currentState = 0;
        testTrace = [];
        let detections = [];

        for (let i = 0; i < input.length; i++) {
            const inputChar = input[i];

            const transition = currentTransitions.find(t =>
                t.from === currentState && t.input === inputChar
            );

            if (!transition) {
                testResult.className = 'test-result error';
                testResult.innerHTML = `<strong>Error:</strong> No transition found from state ${currentStates[currentState].label} with input ${inputChar}`;
                testResult.style.display = 'block';
                return;
            }

            const oldState = currentState;
            currentState = transition.to;

            let output;
            if (isMoore) {
                output = currentStates[currentState].label.split('/')[1];
            } else {
                output = transition.output;
            }

            testTrace.push({
                step: i + 1,
                input: inputChar,
                fromState: oldState,
                toState: currentState,
                transitionKey: `${oldState}-${inputChar}`,
                output: output,
                matched: output === '1'
            });

            if (output === '1') {
                detections.push(i);
            }
        }

        displayTestResults(input, detections);
    }

    function displayTestResults(input, detections) {
        let html = `<div style="margin-bottom: 1.5rem; line-height: 1.8;">
            <div style="margin-bottom: 0.5rem;"><strong>Test Input:</strong> ${input}</div>
            <div style="margin-bottom: 0.5rem;"><strong>Pattern:</strong> ${currentPattern}</div>
            <div style="margin-bottom: 0.5rem;"><strong>Detections:</strong> ${detections.length > 0 ? `Found at position(s): ${detections.map(d => d + 1).join(', ')}` : 'None'}</div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted);"><strong>Click steps or use buttons below to see visualization</strong></div>
        </div>`;

        html += '<div style="font-weight: 600; font-size: 1.1rem; margin: 1.5rem 0 1rem 0; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(56, 189, 248, 0.2);">State Transitions:</div>';

        testTrace.forEach((t, index) => {
            html += `<div class="test-step ${t.matched ? 'matched' : ''}" data-step="${index}">
                <span>Step ${t.step}:</span>
                <span>Input: <span class="state-highlight">${t.input}</span></span>
                <span>${currentStates[t.fromState].label} → ${currentStates[t.toState].label}</span>
                <span>Output: <span class="state-highlight">${t.output}</span></span>
                ${t.matched ? '<span style="color: #22c55e;">✓ MATCH</span>' : ''}
            </div>`;
        });

        testResult.className = 'test-result success';
        testResult.innerHTML = html;
        testResult.style.display = 'block';

        document.querySelectorAll('.test-step').forEach(step => {
            step.addEventListener('click', function () {
                const stepIndex = parseInt(this.getAttribute('data-step'));
                goToStep(stepIndex);
            });
        });

        stepNavigation.classList.add('active');
        currentStepIndex = -1;
        updateStepInfo();
        resetVisualization();
    }

    prevStepBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            goToStep(currentStepIndex - 1);
        } else if (currentStepIndex === 0) {
            goToStep(-1);
        }
    });

    nextStepBtn.addEventListener('click', () => {
        if (currentStepIndex < testTrace.length - 1) {
            goToStep(currentStepIndex + 1);
        }
    });

    resetBtn.addEventListener('click', () => {
        goToStep(-1);
    });

    function goToStep(stepIndex) {
        currentStepIndex = stepIndex;
        updateStepInfo();
        visualizeStep(stepIndex);

        // Update step highlighting
        document.querySelectorAll('.test-step').forEach((step, i) => {
            if (i === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function updateStepInfo() {
        if (currentStepIndex === -1) {
            stepInfo.textContent = `Initial State`;
            prevStepBtn.disabled = true;
            nextStepBtn.disabled = testTrace.length === 0;
        } else {
            stepInfo.textContent = `Step ${currentStepIndex + 1} / ${testTrace.length}`;
            prevStepBtn.disabled = false;
            nextStepBtn.disabled = currentStepIndex >= testTrace.length - 1;
        }
    }

    function visualizeStep(stepIndex) {
        resetVisualization();

        if (stepIndex === -1) {
            const startNode = document.querySelector('.node.start-node');
            if (startNode) {
                startNode.classList.add('active-state');
            }
            return;
        }

        const step = testTrace[stepIndex];

        for (let i = 0; i <= stepIndex; i++) {
            const trace = testTrace[i];

            if (i < stepIndex) {
                const fromNode = graphSvg.querySelector(`[data-state-id="${trace.fromState}"]`);
                const toNode = graphSvg.querySelector(`[data-state-id="${trace.toState}"]`);

                if (fromNode) fromNode.classList.add('visited-state');
                if (toNode) toNode.classList.add('visited-state');

                const edge = graphSvg.querySelector(`[data-edge="${trace.fromState}-${trace.input}"]`);
                if (edge) {
                    edge.classList.add('visited-transition');
                }
            }
        }

        const currentNode = graphSvg.querySelector(`[data-state-id="${step.toState}"]`);
        if (currentNode) {
            currentNode.classList.remove('visited-state');
            currentNode.classList.add('active-state');
        }

        const currentEdge = graphSvg.querySelector(`[data-edge="${step.fromState}-${step.input}"]`);
        if (currentEdge) {
            currentEdge.classList.remove('visited-transition');
            currentEdge.classList.add('active-transition');
        }
    }

    function resetVisualization() {
        graphSvg.querySelectorAll('.node').forEach(node => {
            node.classList.remove('active-state', 'visited-state');
        });

        graphSvg.querySelectorAll('.edge').forEach(edge => {
            edge.classList.remove('active-transition', 'visited-transition');
        });
    }
});
