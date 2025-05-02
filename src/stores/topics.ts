import {defineStore} from 'pinia';

export interface TopicNode {
    title: string;
    id?: string;
    contentPath?: string;
    children?: TopicNode[];
}

interface TopicsState {
    topics: TopicNode[];
    selectedTopic: TopicNode | null;
    selectedId: string | null;
    selectedContent: string | null;
    expandedPaths: Set<string>;
    isLoading: boolean;
    error: string | null;
}

const findTopicInTree = (topics: TopicNode[], id: string): TopicNode | null => {
    for (const topic of topics) {
        if (topic.id === id) return topic;
        if (topic.children) {
            const found = findTopicInTree(topic.children, id);
            if (found) return found;
        }
    }
    return null;
};

export const useTopics = defineStore('topics', {
    state: (): TopicsState => ({
        topics: [],
        selectedTopic: null,
        selectedId: null,
        selectedContent:  null,
        expandedPaths: new Set<string>(),
        isLoading: false,
        error: null,
    }),
    actions: {
        async fetchTopics(): Promise<void> {
            try {
                this.isLoading = true;
                const response = await fetch('/data.json');

                if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);

                const data: { toc: TopicNode[] } = await response.json();

                this.topics = data.toc;
                this.error = null;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
            } finally {
                this.isLoading = false;
            }
        },
        async fetchTopicContent(): Promise<void> {
            try {
                if (!this.selectedTopic?.contentPath) return;

                this.isLoading = true;
                const response = await fetch(this.selectedTopic.contentPath);

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                this.selectedContent = await response.text();
                this.error = null;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Ошибка загрузки контента';
                this.selectedContent = null;
            } finally {
                this.isLoading = false;
            }
        },
        selectTopic(id: string): void {
            const topic = findTopicInTree(this.topics, id);

            if (topic?.contentPath === undefined) return;

            this.selectedTopic = topic;
            this.selectedId = id;
            this.fetchTopicContent();
        },
        toggleNodeExpansion(path: string): void {
            const newSet = new Set(this.expandedPaths);
            newSet.has(path) ? newSet.delete(path) : newSet.add(path);
            this.expandedPaths = newSet;
        },

        collectAllPaths(nodes: TopicNode[], parentPath: string = ''): string[] {
            return nodes.flatMap(node => {
                const currentPath = parentPath ? `${parentPath}/${node.title}` : node.title;
                const childPaths = node.children ? this.collectAllPaths(node.children, currentPath) : [];
                return [currentPath, ...childPaths];
            });
        },

        expandAllNodes(): void {
            const allPaths = this.collectAllPaths(this.topics);
            this.expandedPaths = new Set(allPaths);
        },

        collapseAllNodes(): void {
            this.expandedPaths = new Set();
        },

        isExpanded(path: string): boolean {
            return this.expandedPaths.has(path);
        }
    },
})