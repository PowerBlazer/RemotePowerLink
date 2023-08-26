using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Abstractions;

public class BaseEntity<T>
{
    [Key]
    public T? Id { get; set; }
}