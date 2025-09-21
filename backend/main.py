# backend/main.py - Enhanced DAG validation
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Set
import json
from collections import defaultdict, deque

app = FastAPI(
    title="VectorShift Pipeline API",
    description="Advanced pipeline analysis with bulletproof DAG validation",
    version="1.0.0"
)

# Enhanced CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None

class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def is_dag_robust(nodes: List[Node], edges: List[Edge]) -> tuple[bool, List[str], Dict[str, Any]]:
    """
    Bulletproof DAG validation with multiple algorithms and detailed debugging
    Returns (is_dag, cycle_info, debug_info)
    """
    
    # Debug information
    debug_info = {
        "total_nodes": len(nodes),
        "total_edges": len(edges),
        "node_ids": [node.id for node in nodes],
        "edge_connections": [(edge.source, edge.target) for edge in edges]
    }
    
    if len(nodes) == 0:
        return True, [], {**debug_info, "reason": "No nodes"}
    
    if len(edges) == 0:
        return True, [], {**debug_info, "reason": "No edges - disconnected nodes are DAG"}
    
    adj_list = defaultdict(list)
    in_degree = defaultdict(int)
    node_ids = {node.id for node in nodes}
    
    for node in nodes:
        in_degree[node.id] = 0
    
    valid_edges = []
    invalid_edges = []
    
    for edge in edges:
        source, target = edge.source, edge.target
        
        if source not in node_ids or target not in node_ids:
            invalid_edges.append(f"{source} -> {target}")
            continue
            
        #  immediate cycle
        if source == target:
            return False, [f"Self-loop detected: {source} -> {target}"], {
                **debug_info, 
                "reason": "Self-loop",
                "invalid_edges": invalid_edges
            }
        
        adj_list[source].append(target)
        in_degree[target] += 1
        valid_edges.append((source, target))
    
    debug_info["valid_edges"] = valid_edges
    debug_info["invalid_edges"] = invalid_edges
    
    # Kahn's Algorithm (Topological Sort)
    is_dag_kahn, cycle_nodes_kahn = kahn_algorithm(adj_list, in_degree, node_ids)
    
    # DFS Cycle Detection (Double-check)
    is_dag_dfs, cycle_path_dfs = dfs_cycle_detection(adj_list, node_ids)
    
    # Both methods should agree
    if is_dag_kahn != is_dag_dfs:
        debug_info["warning"] = "Algorithm mismatch - using conservative result"
        is_dag_final = False  # if methods disagree, assume cycle
    else:
        is_dag_final = is_dag_kahn
    
    # Compile cycle info
    cycle_info = []
    if not is_dag_final:
        if cycle_nodes_kahn:
            cycle_info.append(f"Kahn's algorithm detected cycle involving: {', '.join(cycle_nodes_kahn)}")
        if cycle_path_dfs:
            cycle_info.append(f"DFS detected cycle path: {' -> '.join(cycle_path_dfs)}")
        
        # If no specific cycle found but algorithms indicate cycle
        if not cycle_info:
            cycle_info.append("Cycle detected but specific path unclear")
    
    debug_info.update({
        "kahn_result": is_dag_kahn,
        "dfs_result": is_dag_dfs,
        "final_result": is_dag_final
    })
    
    return is_dag_final, cycle_info, debug_info

def kahn_algorithm(adj_list: Dict[str, List[str]], in_degree: Dict[str, int], node_ids: Set[str]) -> tuple[bool, List[str]]:
    """Kahn's algorithm for topological sorting"""
    
    # avoid modifying original
    in_deg_copy = in_degree.copy()
    
    # Find all nodes with no incoming edges
    queue = deque([node_id for node_id in node_ids if in_deg_copy[node_id] == 0])
    processed_nodes = []
    
    while queue:
        current = queue.popleft()
        processed_nodes.append(current)
        
        # Remove current node and update in-degrees
        for neighbor in adj_list[current]:
            in_deg_copy[neighbor] -= 1
            if in_deg_copy[neighbor] == 0:
                queue.append(neighbor)
    
    # If processed all nodes, it's a DAG
    is_dag = len(processed_nodes) == len(node_ids)
    
    # Find nodes involved in cycles
    cycle_nodes = [node_id for node_id in node_ids if in_deg_copy[node_id] > 0]
    
    return is_dag, cycle_nodes

def dfs_cycle_detection(adj_list: Dict[str, List[str]], node_ids: Set[str]) -> tuple[bool, List[str]]:
    """DFS-based cycle detection with path tracking"""
    
    WHITE, GRAY, BLACK = 0, 1, 2
    colors = {node_id: WHITE for node_id in node_ids}
    cycle_path = []
    
    def dfs_visit(node: str, path: List[str]) -> bool:
        colors[node] = GRAY
        path.append(node)
        
        for neighbor in adj_list.get(node, []):
            if colors[neighbor] == GRAY:
                # Back edge found - cycle detected
                cycle_start = path.index(neighbor)
                cycle_path.extend(path[cycle_start:] + [neighbor])
                return True
            elif colors[neighbor] == WHITE and dfs_visit(neighbor, path):
                return True
        
        colors[node] = BLACK
        path.pop()
        return False
    
    # (handles disconnected components)
    for node_id in node_ids:
        if colors[node_id] == WHITE:
            if dfs_visit(node_id, []):
                return False, cycle_path
    
    return True, []

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "VectorShift Pipeline API",
        "version": "1.0.0",
        "message": "🚀 Enhanced DAG validation service running!"
    }

@app.post("/pipelines/parse")
def parse_pipeline(pipeline_data: PipelineData):
    """Enhanced pipeline analysis with bulletproof DAG validation"""
    try:
        nodes = pipeline_data.nodes
        edges = pipeline_data.edges
        
        # Enhanced DAG validation
        is_dag_result, cycle_info, debug_info = is_dag_robust(nodes, edges)
        
        # Basic metrics
        num_nodes = len(nodes)
        num_edges = len(edges)
        
        response = {
            "status": "success",
            "timestamp": "2025-09-21T01:37:00Z",
            
            # Required by assessment
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag_result,
            
            # Enhanced analysis
            "cycle_info": cycle_info,
            "debug_info": debug_info,
            
            "validation_summary": {
                "has_cycles": not is_dag_result,
                "cycle_count": len(cycle_info),
                "valid_edges": len(debug_info.get("valid_edges", [])),
                "invalid_edges": len(debug_info.get("invalid_edges", [])),
            }
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Pipeline analysis failed",
                "message": str(e),
                "type": type(e).__name__
            }
        )

# Test endpoint for cycle validation
@app.post("/pipelines/test-cycle")
def test_cycle_detection():
    """Test endpoint with known cycle for validation"""
    
    # Create test data with obvious cycle: A -> B -> C -> A
    test_nodes = [
        Node(id="A", type="test", position={"x": 0, "y": 0}, data={}),
        Node(id="B", type="test", position={"x": 100, "y": 0}, data={}),
        Node(id="C", type="test", position={"x": 200, "y": 0}, data={})
    ]
    
    test_edges = [
        Edge(id="e1", source="A", target="B"),
        Edge(id="e2", source="B", target="C"),
        Edge(id="e3", source="C", target="A")  #  creates the cycle!
    ]
    
    is_dag_result, cycle_info, debug_info = is_dag_robust(test_nodes, test_edges)
    
    return {
        "test_description": "Known cycle: A -> B -> C -> A",
        "is_dag": is_dag_result,
        "should_be_dag": False,
        "test_passed": not is_dag_result,
        "cycle_info": cycle_info,
        "debug_info": debug_info
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
