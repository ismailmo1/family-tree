from enum import Enum


class TransactionType(Enum):
    READ = "read"
    WRITE = "write"
