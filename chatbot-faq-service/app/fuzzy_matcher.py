# fuzzy_matcher.py
# Lógica de comparación difusa (fuzzy matching) para encontrar la mejor respuesta a una pregunta del usuario en la base de FAQs.
# No almacena datos, solo compara y busca coincidencias usando rapidfuzz.

# Fuzzy Matching Module for FAQ Chatbot

from rapidfuzz import fuzz, process
from typing import Optional, Tuple
from .faqs import FAQS, get_all_questions

class FuzzyMatcher:
    def __init__(self, threshold: float = 50.0):
        """
        Initialize the fuzzy matcher with a similarity threshold.

        Args:
            threshold: Minimum similarity score (0-100) to consider a match
        """
        self.threshold = threshold
        self.questions = get_all_questions()

    def find_best_match(self, user_query: str) -> Optional[Tuple[str, float, dict]]:
        """
        Find the best matching FAQ for a user query using fuzzy string matching.

        Args:
            user_query: The user's question

        Returns:
            Tuple of (matched_question, similarity_score, faq_dict) or None if no match above threshold
        """
        # Use rapidfuzz to find the best match
        result = process.extractOne(
            user_query,
            self.questions,
            scorer=fuzz.token_sort_ratio,  # Good for handling word order variations
            score_cutoff=self.threshold
        )

        if result:
            matched_question, score, index = result
            # Find the corresponding FAQ
            faq = FAQS[index]
            return matched_question, score, faq

        return None

    def find_multiple_matches(self, user_query: str, limit: int = 3) -> list[Tuple[str, float, dict]]:
        """
        Find multiple potential matches for a user query.

        Args:
            user_query: The user's question
            limit: Maximum number of matches to return

        Returns:
            List of tuples (matched_question, similarity_score, faq_dict)
        """
        results = process.extract(
            user_query,
            self.questions,
            scorer=fuzz.token_sort_ratio,
            limit=limit,
            score_cutoff=self.threshold
        )

        matches = []
        for result in results:
            matched_question, score, index = result
            faq = FAQS[index]
            matches.append((matched_question, score, faq))

        return matches

    def get_similarity_score(self, query1: str, query2: str) -> float:
        """
        Calculate similarity score between two strings.

        Args:
            query1: First string
            query2: Second string

        Returns:
            Similarity score (0-100)
        """
        return fuzz.token_sort_ratio(query1, query2)

# Global instance for easy access
fuzzy_matcher = FuzzyMatcher(threshold=50.0)

def get_fuzzy_response(user_message: str) -> Optional[str]:
    """
    Get a response using fuzzy matching against the FAQ database.

    Args:
        user_message: The user's message

    Returns:
        Response string or None if no match found
    """
    match = fuzzy_matcher.find_best_match(user_message)

    if match:
        matched_question, score, faq = match
        response = faq["answer"]
        return f"{response}"

    return None