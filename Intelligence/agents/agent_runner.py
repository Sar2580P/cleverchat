from llama_index.core.agent import AgentRunner
from typing import (
    Any,
    List,
    Optional,
    Sequence,
    Type,
    Callable,
)
from collections import deque
from llama_index.core.agent.react.formatter import ReActChatFormatter
from llama_index.core.agent.react.output_parser import ReActOutputParser
from llama_index.core.agent.react.step import ReActAgentWorker
from llama_index.core.agent.runner.base import AgentRunner
from llama_index.core.base.llms.types import ChatMessage
from llama_index.core.callbacks import (
    CallbackManager,
)
from llama_index.core.agent.types import (
    BaseAgent,
    BaseAgentWorker,
    Task,
    TaskStep,
    TaskStepOutput,
)
from llama_index.core.agent.runner.base import TaskState
from llama_index.core.llms.llm import LLM
from llama_index.core.memory.chat_memory_buffer import ChatMemoryBuffer
from llama_index.core.memory.types import BaseMemory
from llama_index.core.objects.base import ObjectRetriever
from llama_index.core.settings import Settings
from llama_index.core.tools import BaseTool, ToolOutput
from llama_index.core.prompts.mixin import PromptMixinType
from agents.agent_worker import MyAgentWorker
from testing_dag.DAG import agent_executor
from testing_dag.node import Node ,create_graph_from_nodes_json
from collections import deque
from Intelligence.utils.misc_utils import logger, assert_


class MyAgentRunner(AgentRunner):
    def __init__(
        self,
        tools: Sequence[BaseTool],
        llm: LLM,
        memory: BaseMemory,
        max_iterations: int = 10,
        react_chat_formatter: Optional[ReActChatFormatter] = None,
        output_parser: Optional[ReActOutputParser] = None,
        callback_manager: Optional[CallbackManager] = None,
        verbose: bool = False,
        tool_retriever: Optional[ObjectRetriever[BaseTool]] = None,
        context: Optional[str] = None,
        handle_reasoning_failure_fn: Optional[
            Callable[[CallbackManager, Exception], ToolOutput]
        ] = None,
    ) -> None:
        """Init params."""
        callback_manager = callback_manager or llm.callback_manager
        if context and react_chat_formatter:
            raise ValueError("Cannot provide both context and react_chat_formatter")
        if context:
            react_chat_formatter = ReActChatFormatter.from_context(context)

        step_engine = MyAgentWorker.from_tools(
            tools=tools,
            tool_retriever=tool_retriever,
            llm=llm,
            max_iterations=max_iterations,
            react_chat_formatter=react_chat_formatter,
            output_parser=output_parser,
            callback_manager=callback_manager,
            verbose=verbose,
            handle_reasoning_failure_fn=handle_reasoning_failure_fn,
        )
        super().__init__(
            step_engine,
            memory=memory,
            llm=llm,
            callback_manager=callback_manager,
        )
        print(f"inside MyAgent, agent_worker = {self.agent_worker}")

    @classmethod
    def from_tools(
        cls,
        tools: Optional[List[BaseTool]] = None,
        tool_retriever: Optional[ObjectRetriever[BaseTool]] = None,
        llm: Optional[LLM] = None,
        chat_history: Optional[List[ChatMessage]] = None,
        memory: Optional[BaseMemory] = None,
        memory_cls: Type[BaseMemory] = ChatMemoryBuffer,
        max_iterations: int = 10,
        react_chat_formatter: Optional[ReActChatFormatter] = None,
        output_parser: Optional[ReActOutputParser] = None,
        callback_manager: Optional[CallbackManager] = None,
        verbose: bool = False,
        context: Optional[str] = None,
        handle_reasoning_failure_fn: Optional[
            Callable[[CallbackManager, Exception], ToolOutput]
        ] = None,
        **kwargs: Any,
    ) -> "MyAgentRunner":
        """Convenience constructor method from set of BaseTools (Optional).

        NOTE: kwargs should have been exhausted by this point. In other words
        the various upstream components such as BaseSynthesizer (response synthesizer)
        or BaseRetriever should have picked up off their respective kwargs in their
        constructions.

        If `handle_reasoning_failure_fn` is provided, when LLM fails to follow the response templates specified in
        the System Prompt, this function will be called. This function should provide to the Agent, so that the Agent
        can have a second chance to fix its mistakes.
        To handle the exception yourself, you can provide a function that raises the `Exception`.

        Note: If you modified any response template in the System Prompt, you should override the method
        `_extract_reasoning_step` in `ReActAgentWorker`.

        Returns:
            ReActAgent
        """
        llm = llm or Settings.llm
        if callback_manager is not None:
            llm.callback_manager = callback_manager
        memory = memory or memory_cls.from_defaults(
            chat_history=chat_history or [], llm=llm
        )
        return cls(
            tools=tools or [],
            tool_retriever=tool_retriever,
            llm=llm,
            memory=memory,
            max_iterations=max_iterations,
            react_chat_formatter=react_chat_formatter,
            output_parser=output_parser,
            callback_manager=callback_manager,
            verbose=verbose,
            context=context,
            handle_reasoning_failure_fn=handle_reasoning_failure_fn,
        )
        
    def create_task(self, input: str, **kwargs: Any) -> Task:
        """Create task."""
        if not self.init_task_state_kwargs:
            extra_state = kwargs.pop("extra_state", {})
        else:
            if "extra_state" in kwargs:
                raise ValueError(
                    "Cannot specify both `extra_state` and `init_task_state_kwargs`"
                )
            else:
                extra_state = self.init_task_state_kwargs

        callback_manager = kwargs.pop("callback_manager", self.callback_manager)
        task = Task(
            input=input,
            memory=self.memory,
            extra_state=extra_state,
            callback_manager=callback_manager,
            **kwargs,
        )
        # # put input into memory
        # self.memory.put(ChatMessage(content=input, role=MessageRole.USER))

        # get initial step from task, and put it in the step queue
        initial_step = self.agent_worker.initialize_step(task)

        task_state = TaskState(
            task=task,
            step_queue=deque([initial_step]),
        )
        # add it to state
        self.state.task_dict[task.task_id] = task_state

        return task

    def _get_prompt_modules(self) -> PromptMixinType:
        """Get prompt modules."""
        return {"agent_worker": self.agent_worker}
    
    def create_dag_task(self, input: str, **kwargs: Any) -> Task:
        agent_executor({'input' : input})
        dag_setup :dict[str, Any] = create_graph_from_nodes_json('testing_dag/web_schema.json')
        
        # applying topo-bfs starting with nodes having 0 indegree
        deq = deque()
        
        # assuming : no-cycles present
        for i, in_deg in enumerate(dag_setup['in_deg']):
            if in_deg == 0:
                deq.append(i)
                
        instance_display_order = []
        while len(deq)>0:
            node_idx = deq.popleft()
            instance_display_order.append(node_idx)
            node_instance:Node = dag_setup['instance_mapping'][node_idx]
            node_instance.run_node()
            logger.info(f"tool_name : {node_instance.tool_name} , input : {node_instance.tool_input} , output : {node_instance.output}\n\n")
            for child_idx in node_instance.children_node_idxs:
                dag_setup['in_deg'][child_idx] -= 1
                if dag_setup['in_deg'][child_idx] ==0 : 
                    deq.append(child_idx)
        
        logger.debug(f'display_order : {instance_display_order}')
        logger.debug('\n---------Completed processing all nodes--------\n')
        return 
        
