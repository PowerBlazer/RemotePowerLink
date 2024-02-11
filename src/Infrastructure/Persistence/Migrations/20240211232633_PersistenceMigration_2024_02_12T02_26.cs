using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_02_12T02_26 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "identities",
                keyColumn: "id",
                keyValue: 1L,
                column: "user_id",
                value: 2L);

            migrationBuilder.UpdateData(
                table: "proxies",
                keyColumn: "id",
                keyValue: 1L,
                column: "user_id",
                value: 2L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "identities",
                keyColumn: "id",
                keyValue: 1L,
                column: "user_id",
                value: 1L);

            migrationBuilder.UpdateData(
                table: "proxies",
                keyColumn: "id",
                keyValue: 1L,
                column: "user_id",
                value: 1L);
        }
    }
}
